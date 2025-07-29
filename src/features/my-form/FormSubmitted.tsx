"use client";

import { CheckCircle, Clock, FileText, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export default function FormSubmitted() {
  const { signOut } = useUser();
  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 bg-white border rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Form Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-sm">
                Thank you for submitting your application. Your form is now
                under review.
              </p>
            </motion.div>

            {/* Status Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
            >
              <div className="flex items-center space-x-3 p-4 bg-white border  rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-blue-900">
                    Application Status
                  </p>
                  <p className="text-sm text-blue-700">Submitted</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white border rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium text-orange-900">Review Status</p>
                  <p className="text-sm text-orange-700">Under Review</p>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 rounded-lg p-6 text-left"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Our team will review your application within 3-5 business days
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You will receive an email notification about the status of
                  your application
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  If approved, you will receive further instructions on next
                  steps
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-sm text-gray-500"
            >
              <p>
                Have questions? Contact us at{" "}
                <a
                  href="mailto:support@produce4lagos.com"
                  className="text-primary hover:underline"
                >
                  support@produce4lagos.com
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <div className=" flex flex-col justify-center items-center mt-5">
        <Button onClick={signOut} size={"lg"}>
          Logout
          <LogOut />
        </Button>
      </div>
    </div>
  );
}
