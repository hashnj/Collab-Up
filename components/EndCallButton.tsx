"use client";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
	const router = useRouter();

	const call = useCall();
	const { useLocalParticipant } = useCallStateHooks();
	const localParticipant = useLocalParticipant();

	const isMeetingOwner =
		localParticipant &&
		call?.state.createdBy &&
		localParticipant.userId === call.state.createdBy.id;

	if (!isMeetingOwner) return null;

	return (
		<div className="rounded-lg">
			<Button
				onClick={async () => {
					await call.endCall();
					router.push("/");
				}}
				className='bg-red-500 rounded-lg'>
				End Call for everyone
			</Button>
		</div>
	);
};

export default EndCallButton;