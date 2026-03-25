import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/auth";
import User from "@/model/User";

export async function PUT(req) {
	await dbConnect();

	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("auth_token")?.value;

		if (!token) {
			return Response.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		if (!decoded?.id) {
			return Response.json({ message: "Invalid token" }, { status: 401 });
		}

		const { currentPassword, newPassword } = await req.json();

		if (!currentPassword || !newPassword) {
			return Response.json(
				{ message: "Current password and new password are required" },
				{ status: 400 }
			);
		}

		if (newPassword.length < 6) {
			return Response.json(
				{ message: "New password must be at least 6 characters" },
				{ status: 400 }
			);
		}

		const admin = await User.findById(decoded.id);
		if (!admin || admin.userType !== "admin") {
			return Response.json(
				{ message: "Admin user not found" },
				{ status: 404 }
			);
		}

		const isPasswordValid = await admin.comparePassword(currentPassword);
		if (!isPasswordValid) {
			return Response.json(
				{ message: "Current password is incorrect" },
				{ status: 400 }
			);
		}

		const isSamePassword = await admin.comparePassword(newPassword);
		if (isSamePassword) {
			return Response.json(
				{ message: "New password must be different from current password" },
				{ status: 400 }
			);
		}

		admin.password = newPassword;
		await admin.save();

		return Response.json({ message: "Password updated successfully" });
	} catch (error) {
		console.error("Admin password update error:", error);
		return Response.json(
			{ message: "Failed to update password" },
			{ status: 500 }
		);
	}
}
