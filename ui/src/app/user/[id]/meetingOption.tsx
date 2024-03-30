"use client";

import MeetingPoint from "@/common/MeetingPoint";


export default function MeetingOption({meeting, tag}: {meeting: MeetingPoint, tag: number}) {
    
    
    
    return (
      <li>
        {meeting.id}  {meeting.name}  {meeting.length}  {tag}
      </li>
    );
  }