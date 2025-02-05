"use client";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallsById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

const Meeting = ({ params: { id } }: { params: { id: string } }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { user, isLoaded } = useUser();
	const [isSetupComplete, setIsSetupComplete] = useState(false);
	const { call, isCallLoading } = useGetCallById(id);
	if (!isLoaded || isCallLoading) return <Loader />;
	return (
		<main className='h-screen w-full'>
			{/* to get the call we are in addig a hook*/}
			{/* call={} */}
			<StreamCall call={call}>
				<StreamTheme>
					{!isSetupComplete ? (
						<MeetingSetup setIsSetupComplete={setIsSetupComplete} />
					) : (
						<MeetingRoom />
					)}
				</StreamTheme>
			</StreamCall>
			Meeting Room: #{id}
		</main>
	);
};

export default Meeting;