import Request from "../database/requestDB.js";



export const create = async (req, res) => {
  try {
    const {
      type,
      brand,
      model,
      issue,
      issueDescription,
      status,
      userId,
      technicianId
    } = req.body;

    // Basic validation
    if (!type || !brand || !model || !issue || !issueDescription || !userId || !technicianId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    // Map uploaded files to array
    const uploadedLinks = req.files.map(file => ({
      url: file.path,           // Cloudinary URL
      public_id: file.filename  // Cloudinary public_id
    }));
    
    // Include uploadedLinks in the Request document
    const newRequest = new Request({
      type,
      brand,
      model,
      issue,
      issueDescription,
      status,
      userId,
      technicianId,
      pic: uploadedLinks
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json({
      message: "Request created successfully",
      request: savedRequest
    });

  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ message: "Internal server error" });
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

    await request.deleteOne(); // or Request.findByIdAndDelete(id);

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

