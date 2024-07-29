import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
// import { z } from "zod";
// import { verifySchema } from "@/schemas/verifySchema";

// const VerifyCodeQuerySchema = z.object({
//   code: verifySchema,
// });

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    // const result = VerifyCodeQuerySchema.safeParse(code);

    // if (!result.success) {
    //   const verifyCodeErrors = result.error.format().code?._errors || [];
    //   return Response.json(
    //     {
    //       success: false,
    //       message:
    //         verifyCodeErrors?.length > 0
    //           ? verifyCodeErrors?.join(", ")
    //           : "Invalid verify code",
    //     },
    //     { status: 400 }
    //   );
    // }

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user)
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (!isCodeValid)
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    else if (!isCodeNotExpired)
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    else {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verify successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error verify code ", error);
    return Response.json(
      { success: false, message: "Error verify code" },
      { status: 500 }
    );
  }
}
