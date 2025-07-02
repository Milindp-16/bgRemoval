// controllers/userController.js

import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // Initialize Svix with your secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify raw body and get back the parsed payload
    const payload = whook.verify(
      req.body, // raw buffer
      {
        "svix-id":        req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      }
    );

    // Now payload is guaranteed to be an object with .data and .type
    const { data, type } = payload;

    switch (type) {
      case "user.created": {
        await userModel.create({
          clerkId:   data.id,
          email:     data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName:  data.last_name,
          photo:     data.image_url,
        });
        return res.sendStatus(200);
      }

      case "user.updated": {
        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          {
            email:     data.email_addresses[0].email_address,
            firstName: data.first_name,
            lastName:  data.last_name,
            photo:     data.image_url,
          },
          { new: true, upsert: false }
        );
        return res.sendStatus(200);
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        return res.sendStatus(200);
      }

      default:
        // Unhandled event type
        return res.sendStatus(204);
    }
  } catch (err) {
    console.error("Webhook handling error:", err);
    // 400 = Bad Request; signature verification failed or malformed payload
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    if (!clerkId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing clerkId in request body" });
    }

    const userData = await userModel.findOne({ clerkId });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, credits: userData.creditBalance });
  } catch (err) {
    console.error("userCredits error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
