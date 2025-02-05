"use client";
import React, { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

// import { useRouter } from "next/router";
// using newer one caused its designed for app directory

const MeetingTypeList = () => {
	const { toast } = useToast();

	const router = useRouter();
	const [meetingState, setMeetingState] = useState<
		"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
	>();
	const [values, setValues] = useState({
		dateTime: new Date(),
		description: "",
		link: "",
	});
	const [callDetails, setCallDetails] = useState<Call>();
	const { user } = useUser();
	const client = useStreamVideoClient();

	const createMeeting = async () => {
		if (!user || !client) return;

		try {
			if (!values.dateTime) {
				toast({
					title: "Please select a date and Time",
				});
			}
			// generate random id fir call id
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			if (!call) throw new Error("Failed to create meeting");
			console.log(call);
			const startsAt =
				values.dateTime.toISOString() || new Date(Date.now()).toISOString();

			const description = values.description || "Instant meeting";
			// creating a meeting

			console.log("in try 1");
			await call.getOrCreate({
				data: {
					starts_at: startsAt,
					custom: {
						description,
					},
				},
			});

			console.log("in tryt after");
			setCallDetails(call);

			if (!values.description) {
				router.push(`/meeting/${call.id}`);
			}
			toast({
				title: "meeting created",
			});
		} catch (e) {
			console.log("in catch");
			console.error(e);
			toast({
				title: "Failed to create meeting",
			});
		}
	};

	// meeting link
	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails}`;
	return (
		<section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
			<HomeCard
				img='/icons/add-meeting.svg'
				title='New Meeting'
				description='Start an instant meeting'
				handleClick={() => {
					setMeetingState("isInstantMeeting");
					console.log(meetingState);
				}}
				className='bg-orange-1'
			/>
			<HomeCard
				img='/icons/schedule.svg'
				title='Schedule Meeting'
				description='Plan your meeting'
				handleClick={() => setMeetingState("isScheduleMeeting")}
				className='bg-blue-1'
			/>
			<HomeCard
				img='/icons/recordings.svg'
				title='View Recordings'
				description='CheckOut your recordings'
				handleClick={() => router.push("/recordings")}
				// handleClick={() => router.push("/recordings")}
				className='bg-purple-1'
			/>
			<HomeCard
				img='/icons/join-meeting.svg'
				title='Join Meeting'
				description='Via Invitation link'
				handleClick={() => setMeetingState("isJoiningMeeting")}
				className='bg-yellow-1'
			/>

			{!callDetails ? (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='creating meeting'
					handleClick={() => createMeeting()}>
					<div className='flex flex-col gap-2.5'>
						<label className='text-base text-normal leading-[22px] text-sky-1'>
							Add a description
						</label>
						<Textarea
							className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
							onChange={(e) =>
								setValues({ ...values, description: e.target.value })
							}
						/>
						<div className='flex w-full flex-col gap-2.5'>
							<label className='text-base text-normal leading-[22px] text-sky-1'>
								Select Date and Time
							</label>
							<ReactDatePicker
								selected={values.dateTime}
								onChange={(date) => setValues({ ...values, dateTime: date! })}
								showTimeSelect
								timeFormat='HH:mm'
								timeIntervals={15}
								timeCaption='time'
								dateFormat='MMMM d, YYYY h:mm aa'
								className='w-full rounded bg-dark-2 p-2 focus:outline-none'
							/>
						</div>
					</div>
				</MeetingModal>
			) : (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title='meeting created'
					className='text-center'
					handleClick={() => {
						navigator.clipboard.writeText(meetingLink);
						toast({ title: "Link Copied" });
					}}
					image='/icons/checked.svg'
					buttonIcon='/icons/copy.svg'
					buttonText='Copy Meeting Link'
				/>
			)}
			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='start an instant meeting'
				className='text-center'
				buttonText='Start Meeting'
				handleClick={() => createMeeting()}
			/>
			<MeetingModal
				isOpen={meetingState === "isJoiningMeeting"}
				onClose={() => setMeetingState(undefined)}
				title='Type link here'
				className='text-center'
				buttonText='Join Meeting'
				handleClick={() => router.push(values.link)}>
				<Input
					placeholder='meeting link'
					className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
					onChange={(e) => setValues({ ...values, link: e.target.value })}
				/>
			</MeetingModal>
		</section>
	);
};

export default MeetingTypeList;