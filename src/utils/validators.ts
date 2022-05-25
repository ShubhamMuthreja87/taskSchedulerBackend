import { Types } from "mongoose";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const validatePhoneNoLength = (value: any, helper: any): any => {
	if (typeof value === "number" && value.toString().length !== 10)
		return helper.message("Phone No must of 10 digits" as any);
	return value;
};

export const validateObjectId = (value: string, helper: any) => {
	if (!Types.ObjectId.isValid(value))
		return helper.message("Invalid ID Passed");
	return value;
};
