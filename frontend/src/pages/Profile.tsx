import { FaUser, FaCog, FaListAlt, FaUserCircle, FaPlus } from "react-icons/fa";
import React from "react";
import { useState } from "react";

const Sidebar = () => {
  return (
    <div className="flex flex-col bg-gray-800 w-64 h-screen text-white">
      {/* Sidebar Content */}
      {/* ... */}
      {/* Profile Icon */}
      <div className="flex-col items-center justify-center p-4 border-b border-gray-600">
        <FaUserCircle className="text-4xl" />
        <h3 className="font-light mt-2">
          <em>Developer</em>
        </h3>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col p-4 space-y-4">
        {/* View Contributions */}
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <FaListAlt className="text-lg" />
          <span>Manage milestones</span>
        </div>
        {/* Settings */}
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <FaCog className="text-lg" />
          <span>Settings</span>
        </div>

        {/* Account Details */}
        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <FaUser className="text-lg" />
          <span>Account Details</span>
        </div>
      </div>
    </div>
  );
};

interface Milestone {
  text: string;
  completed: boolean;
}

const MainContent = () => {
  const [milestone, setMilestone] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const handleAddMilestone = () => {
    console.log("handle add");
    if (milestone.trim() !== "") {
      setMilestones((prev) => {
        const res = [...prev, { text: milestone, completed: false }];
        updateProgress(res);
        return res;
      });
      setMilestone("");
    }
  };

  const handleToggleCompletion = (index: number) => {
    if (milestones && index >= 0 && index < milestones.length) {
      const updatedMilestones = [...milestones];
      updatedMilestones[index]!.completed =
        !updatedMilestones[index]!.completed;
      setMilestones((prev) => {
        const updatedMilestones = [...prev];
        updatedMilestones[index]!.completed =
          !updatedMilestones[index]!.completed;
        updateProgress(updatedMilestones);
        return updatedMilestones;
      });
      // updateProgress();
    }
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones && index >= 0 && index < milestones.length) {
      setMilestones((prev) => {
        const updatedMilestones = [...prev];
        updatedMilestones.splice(index, 1);

        updateProgress(updatedMilestones);
        return updatedMilestones;
      });
      // updateProgress();
    }
  };

  const updateProgress = (ms: any) => {
    console.log("profress");
    console.log(ms.filter((m: any) => m.completed).length);
    console.log(ms.length);
    const totalMilestones = ms.length;
    const completedMilestones = ms.filter((m: any) => m.completed).length;
    const newProgress = (completedMilestones / totalMilestones) * 100 || 0;
    setProgress(newProgress);
  };
  return (
    <div className="flex flex-col items-center p-8 w-full bg-background text-white">
      <h1 className="text-3xl font-bold mb-6">Create Milestones</h1>

      {/* Input for adding milestones */}
      <div className="mb-4 w-full flex flex-col items-center">
        <div className="w-1/2 flex flex-col justify-center">
          <textarea
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
            placeholder="Enter your milestone..."
            className="w-full p-2 border border-gray-300 rounded h-36 text-black"
          />
          <br />
          <div className="w-full flex items-center justify-center">
            <button
              onClick={handleAddMilestone}
              className="mt-2 bg-pink-300 text-white px-2 py-2 rounded hover:bg-white hover:text-pink-500 w-1/2"
            >
              <FaPlus className="mr-2" />
              Add Milestone
            </button>
          </div>
        </div>
      </div>

      {/* Milestone List */}
      <ul className="list-disc pl-6 mb-4">
        {milestones.map((item, index) => {
          if (item.text != "") {
            return (
              <li key={index} className="flex items-center mb-2 space-x-4">
                <div className="w-auto h-auto border-2 border-white rounded-lg py-2 px-4 flex justify-between space-x-4">
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  <div className="flex">
                    <button
                      onClick={() => handleToggleCompletion(index)}
                      className="text-pink-300 hover:text-pink-500 mr-2"
                    >
                      {item.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => handleRemoveMilestone(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          }
          return <></>;
        })}
      </ul>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 h-6 rounded-full relative overflow-hidden">
        <div
          className="bg-pink-300 h-full rounded-full"
          style={{
            width: `${progress}%`,
            transition: "width 0.3s ease-in-out", // Adjust the duration and easing as needed
          }}
        ></div>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex max-w-screen min-h-screen ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

const Profile = () => {
  return (
    <div className="bg-white flex h-screen ">
      <div className="flex flex-col bg-gray-800 w-64 h-full text-white px-8">
        <Sidebar />
      </div>
      <MainContent />
    </div>
  );
};

export default Profile;
