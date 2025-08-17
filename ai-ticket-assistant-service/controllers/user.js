import UserModel from '../models/User.js';

export const UpdateUser = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(401).json({
        error: "Action not allowed"
      });
    }

    const { email, role: updatedRole, skills: updatedSkills } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const { role: currentRole, skills: currentSkills } = user;

    await UserModel.updateOne(
      { email },
      {
        role: updatedRole ? updatedRole : currentRole,
        skills: updatedSkills ? updatedSkills : currentSkills,
      }
    );

    return res.status(200).json({
      "message": "user updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: 'User update failed',
      details: error.message,
    });
  }
};
