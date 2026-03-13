"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";

interface Member {
  id: string;
  name: string;
  batch: string;
  course: string;
  branch: string;
  profile_image_url: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('batch_members')
          .select('*')
          .order('batch', { ascending: false })
          .order('name', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Grouping logic
  const groupedMembers = members.reduce((acc, person) => {
    const batch = person.batch || "Unknown";
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(person);
    return acc;
  }, {} as Record<string, Member[]>);

  const sortedBatchKeys = Object.keys(groupedMembers).sort((a, b) => b.localeCompare(a));

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <Container className="px-6 py-16">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-gray-800 mb-6">
            Our <span className="text-black">Members</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Meet the amazing community of Saharians from all walks of life.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-20">
            {sortedBatchKeys.map((batch) => (
              <div key={batch} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-serif font-bold text-gray-800">
                    Batch of <span className="text-black">{batch}</span>
                  </h2>
                  <div className="h-px bg-gray-200 flex-grow" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {groupedMembers[batch].map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-gray-200 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gray-50 shadow-inner bg-gray-50 flex items-center justify-center relative">
                        {member.profile_image_url ? (
                          <Image 
                            src={member.profile_image_url} 
                            alt={member.name} 
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-gray-300" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{member.course} - {member.branch}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 italic">No members found in the directory yet.</div>
        )}
      </Container>
    </main>
  );
}