"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useGetCallById } from "@/hooks/useGetCallsById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";
const Table = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className='flex flex-col items-start gap-2 '>
			<h1 className='text-base font-medium text-sky-1 lg:text-xl'>{title}</h1>
			<h1 className=' truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl'>
				{description}
			</h1>
		</div>
	);
};
const PersonalRoom = () => {
	const client = useStreamVideoClient();
	const { user } = useUser();
	const router = useRouter();
	const meetingID = user?.id;
	const { call } = useGetCallById(meetingID!);

	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingID}?personal=true`;
	const startRoom = async () => {
		if (!client || !user) return;

		if (!call) {
			const newCall = client?.call("default", meetingID!);
			await newCall.getOrCreate({
				data: {
					starts_at: new Date().toISOString(),
				},
			});
		}

		router.push(`/meeting/${meetingID}?personal=true`);
	};

	return (
		<div>
			<section className='flex size-full flex-col gap-10 text-white'>
				<h1 className='text-3xl font-bold'>PersonalRoom</h1>

				<div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
					<Table
						title='Topic:'
						description={`${user?.username}'s Meeting Room`}
					/>
					<Table title='Meeting ID:' description={meetingID!} />
					<Table title='Invite Link:' description={meetingLink} />
				</div>
				<div className='flex gap-5 '>
					<Button className='bg-blue-1' onClick={startRoom}>
						Start Meeting
					</Button>
					<Button
						className='bg-dark-2'
						onClick={() => {
							navigator.clipboard.writeText(meetingLink);
							toast({
								title: "Link Copied",
							});
						}}>
						Copy Invitation
					</Button>
				</div>
			</section>
		</div>
	);
};

export default PersonalRoom;