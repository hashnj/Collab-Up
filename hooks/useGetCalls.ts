import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(() => {
        const loadCalls = async () => {
            console.log("hi there 2")

            // if (!client || user?.id) return;

            if (!client) {
                toast({ title: "client not found" })
                return
            }
            if (!user) {
                toast({ title: "user not found" })
                return
            }
            setIsLoading(true);
            console.log("hi there")

            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: {
                            $exists: true
                        },
                        $or: [
                            { created_by_user_id: user?.id },
                            { memebers: { $in: [user?.id] } },
                        ]
                    }
                })

                console.log(calls)
                setCalls(calls)

            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        loadCalls();
    }, [client, user?.id])


    const now = new Date();

    const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
        return (startsAt && new Date(startsAt) < now || !!endedAt)
    })
    const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
        return startsAt && new Date(startsAt) > now
    })



    return {
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading
    }
}