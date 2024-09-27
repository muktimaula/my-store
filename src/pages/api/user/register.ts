import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/lib/firebase/servise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // untuk melihat error
    console.log("Request Body:", req.body);

    await signUp(req.body, (status: boolean) => {
      if (status) {
        res
          .status(200)
          .json({ status: true, statusCode: 200, message: "success" });
      } else {
        res
          .status(400)
          .json({ status: false, statusCode: 400, message: "failed" });
      }
    });
  } else {
    res
      .status(405)
      .json({ status: false, statusCode: 405, message: "method not allowed" });
  }
}
// kita cek dengan npm run dev
// berikutnya membuat form yang mengirimkan data ke API tersebut: pages/aunth/register.tsx
