import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { MapPin, Briefcase, Calendar, Mail, Phone } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="/memories/Acer_Wallpaper_01_3840x2400.jpg" />
                  <AvatarFallback className="text-2xl">RS</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                    Rahul Sharma
                  </h1>
                  <p className="text-xl text-black mb-4">Senior Software Engineer at Google</p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge className="bg-black">Batch 2015</Badge>
                    <Badge variant="outline">Alumni</Badge>
                    <Badge variant="outline">Tech Lead</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      Bangalore, India
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined 2015
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Briefcase className="w-4 h-4" />
                      8+ years experience
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Edit Profile</Button>
                  <Button className="bg-black hover:bg-gray-800">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-black" />
                  Professional Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Current Role</h4>
                  <p className="text-gray-600">Senior Software Engineer</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Company</h4>
                  <p className="text-gray-600">Google</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Experience</h4>
                  <p className="text-gray-600">8+ years in software development</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">Python</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-black" />
                  Contact & Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">rahul.sharma@example.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">LinkedIn</h4>
                  <p className="text-gray-600">linkedin.com/in/rahulsharma</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Location</h4>
                  <p className="text-gray-600">Bangalore, Karnataka, India</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-800">Posted in #general channel</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-800">Contributed to Sahara Fest fundraiser</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-800">Connected with 3 new batchmates</p>
                    <p className="text-sm text-gray-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}