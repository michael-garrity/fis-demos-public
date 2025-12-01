import { LearnerProfile } from "@/types";
import { Card, Divider, Chip } from "@heroui/react";
import { Clock, BookOpen, ClipboardList, Heart } from "lucide-react";

interface LearnerProfileCardProps {
  learnerProfile: LearnerProfile;
}

export default function LearnerProfileCard({
  learnerProfile,
}: LearnerProfileCardProps) {
  return (
    <Card className="p-4 w-[300px] shadow-2xl bg-white border border-gray-100 rounded-xl">
      <div className="flex justify-center space-x-3">
        <h3 className="text-xl font-bold text-foreground">
          {learnerProfile.name}
        </h3>
      </div>
      <Divider className="my-2" />

      {/* Profile Details List */}
      <div className="space-y-3 text-sm">
        <div className="flex items-start">
          <Clock size={16} className="text-gray-500 mr-3 mt-0.5 min-w-4" />
          <div>
            <span className="font-semibold text-gray-800">Age:</span>{" "}
            <span className="text-gray-600">{learnerProfile.age}</span>
          </div>
        </div>

        <div className="flex items-start">
          <BookOpen size={16} className="text-gray-500 mr-3 mt-0.5 min-w-4" />
          <div>
            <span className="font-semibold text-gray-800">Reading Level:</span>{" "}
            <span className="text-gray-600">{learnerProfile.readingLevel}</span>
          </div>
        </div>

        <Divider className="my-2" />

        <div className="flex flex-col">
          <span className="font-semibold flex items-center mb-1 text-gray-800">
            <ClipboardList size={16} className="text-gray-500 mr-3" />{" "}
            Experience:
          </span>
          <p className="italic text-gray-600 text-xs pl-6">
            {learnerProfile.experience}
          </p>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold flex items-center mb-1 text-gray-800">
            <Heart size={16} className="text-gray-500 mr-3" /> Interests:
          </span>
          <div className="flex flex-wrap gap-1 pl-6">
            {learnerProfile.interests.map((interest, index) => (
              <Chip key={index} size="sm" color="secondary" variant="flat">
                {interest}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
