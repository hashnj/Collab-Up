'use client'
import StreamVideoProvider from "@/providers/StreamClientProvider";
// import { Metadata } from "next";
import React, { ReactNode } from "react";
import { SessionProvider } from 'next-auth/react'

// export const metadata: Metadata = {
//   title: 'Collab-Up',
//   description: 'A workspace for your team, powered by Stream Chat and Clerk.',
// };

const layout = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<main>
			<StreamVideoProvider>
				<SessionProvider>
					{children}
				</SessionProvider>
			</StreamVideoProvider>
		</main>
	);
};

export default layout;