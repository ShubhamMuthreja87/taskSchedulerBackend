const ErrorCodes = {
	E0: {
		code: "E0",
		message: "Validation Failed. Check request parameters",
	},

	A1: {
		code: "A1",
		message: "Unauthorized.",
	},
	A2: {
		code: "A2",
		message: "Invalid email or password",
	},
	A3: {
		code: "A3",
		message: "Email already exists",
	},
	A4: {
		code: "A4",
		message: "User not found",
	},
	A5: {
		code: "A5",
		message: "Phone No already exists",
	},
	A6:{
		code:"A^",
		message :"Invalid Access Token"
	},
	U1: {
		code: "U1",
		message: "Internal Server Error",
	}
};

export default ErrorCodes;
