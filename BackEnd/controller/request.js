import Request from "../database/requestDB.js";
import Chat from "../database/ChatModel.js";



export const create = async (req, res) => {
  try {
    console.log("REQ BODY RAW:", req.body);

    let parsedAddress = {};

    // address comes as JSON string → parse it
    if (req.body.address) {
      try {
        parsedAddress = JSON.parse(req.body.address);
      } catch (err) {
        return res.status(400).json({ message: "Invalid address format" });
      }
    }

    const {
      type,
      brand,
      model,
      imei,
      issue,
      issueDescription,
      serviceType,
      urgency,
      userId,
      technicianId,
      technicianName
    } = req.body;

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Map uploaded images
    const uploadedLinks = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    // Create new request
    const newRequest = new Request({
      type,
      brand,
      model,
      imei,
      issue,
      issueDescription,
      serviceType,
      urgency,
      address: {
        street: parsedAddress.street,
        city: parsedAddress.city,
        pincode: parsedAddress.pincode,
      },
      userId,
      technicianId,
      technicianName,
      pic: uploadedLinks
    });

    console.log("NEW REQUEST:", newRequest);

    const saved = await newRequest.save();

    res.status(201).json({
      message: "Request created successfully",
      request: saved
    });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};








export const update = async (req, res) => {
  try {
    const { id } = req.params; // request ID
    const updates = req.body;  // other fields to update

    if (!id) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    // Check if request exists
    const existingRequest = await Request.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    let uploadedLinks = [];
    if (req.files && req.files.length > 0) {
      // Map uploaded files to array
      uploadedLinks = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    // Update request
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      {
        $set: updates,
        ...(uploadedLinks.length > 0 && { $push: { pic: { $each: uploadedLinks } } })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Request updated successfully",
      request: updatedRequest
    });

  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Delete associated chat messages
    const roomId = "request_" + id;
    await Chat.deleteMany({ roomId });
    console.log("Chat messages deleted for:", roomId);

    // Delete request itself
    await request.deleteOne();

    return res.status(200).json({ message: "Request deleted successfully" });

  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//only show by the id 
export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    console.log(request);

    if (!Request) {
      console.log("data is not find in the request data base");
    }

    return res.status(200).json(request);
  }
  catch (error) {
    console.error("error in the request show ");
    res.status(500).json();
  }
};


//
export const showid = async (req, res) => {
  try {
    const { role, id } = req.body; // role + id from body
    let requests = [];

    if (role === "admin") {
      // Admin → see all requests
      requests = await Request.find(); // exclude __v field
      return res.status(200).json({ message: "You are admin", requests });
    }

    if (role === "user") {
      // User → only their own requests
      requests = await Request.find({ userId: id });
      return res.status(200).json({ message: "You are user", requests });
    }

    if (role === "technician") {
      // Technician → only assigned requests
      requests = await Request.find({ technicianId: id });
      return res.status(200).json({ message: "You are technician", requests });
    }

    return res.status(400).json({ message: "Invalid role" });

  } catch (error) {
    console.error("Error in showid controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all messages for a specific request
export const getMessagesByRequest = async (req, res) => {
  const { requestId } = req.params;
  const roomId = "request_" + requestId;
  console.log("Request ID:", requestId);

  try {
    console.log("Fetching messages for room:", roomId);

    // Fast DB query (DESC)
    const messages = await Chat.find({ roomId }).sort({ createdAt: 1 }).lean();

    console.log("Fetched messages:", messages);
    console.log("Messages found:", messages.length);

    // Reverse so frontend shows old → new
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

