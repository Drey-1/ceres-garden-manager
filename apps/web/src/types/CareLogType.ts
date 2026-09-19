import type { PendingCareType } from "./TodayOverviewType";

type CareLogType = {
	id: string;
	type: PendingCareType;
	quantity: number | null;
	plantingId: string;
	createdAt: Date;
};

export type { CareLogType };
