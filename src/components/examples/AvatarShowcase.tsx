"use client";

import React from "react";
import Avatar from "@/components/atoms/Avatar";

/**
 * Avatar Showcase Component
 * @description Demonstrates the Avatar component with various username examples
 * Used for testing and showcasing the avatar functionality
 */
const AvatarShowcase: React.FC = () => {
  const testCases = [
    { username: "johndoe", expected: "JOH", description: "Standard username" },
    {
      username: "user123",
      expected: "USE",
      description: "Username with numbers",
    },
    { username: "ab", expected: "AB", description: "Short username" },
    { username: "x", expected: "X", description: "Single character" },
    {
      username: "123abc",
      expected: "ABC",
      description: "Starting with numbers",
    },
    { username: "12345", expected: "U", description: "All numeric (fallback)" },
    {
      username: "user@domain",
      expected: "USE",
      description: "With special characters",
    },
    { username: "JohnDoe", expected: "JOH", description: "Mixed case" },
    { username: "", expected: "U", description: "Empty username (fallback)" },
    { username: "a", expected: "A", description: "Single letter" },
    { username: "alexander", expected: "ALE", description: "Long username" },
    { username: "user_name", expected: "USE", description: "With underscore" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Avatar Component Showcase
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Avatar Test Cases
          </h2>
          <p className="text-gray-600 mb-6">
            Testing the Avatar component with various username formats to ensure
            proper initial extraction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCases.map((testCase, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  username={testCase.username}
                  size={48}
                  isClickable={true}
                  onClick={() =>
                    console.log(`Clicked avatar for: ${testCase.username}`)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    &quot;{testCase.username || "(empty)"}&quot;
                  </p>
                  <p className="text-xs text-gray-500">
                    {testCase.description}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Expected: {testCase.expected}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Different Sizes
          </h2>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <Avatar username="johndoe" size={32} />
              <p className="text-xs text-gray-600 mt-2">32px</p>
            </div>
            <div className="text-center">
              <Avatar username="johndoe" size={40} />
              <p className="text-xs text-gray-600 mt-2">40px (default)</p>
            </div>
            <div className="text-center">
              <Avatar username="johndoe" size={48} />
              <p className="text-xs text-gray-600 mt-2">48px</p>
            </div>
            <div className="text-center">
              <Avatar username="johndoe" size={64} />
              <p className="text-xs text-gray-600 mt-2">64px</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Interactive States
          </h2>
          <p className="text-gray-600 mb-4">
            Hover over and click the avatars to test interaction states:
          </p>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <Avatar
                username="interactive"
                size={48}
                isClickable={true}
                onClick={() => alert("Avatar clicked!")}
              />
              <p className="text-xs text-gray-600 mt-2">Clickable</p>
            </div>
            <div className="text-center">
              <Avatar username="readonly" size={48} />
              <p className="text-xs text-gray-600 mt-2">Read-only</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Implementation Notes
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Extracts up to 3 alphabetic characters from username</li>
            <li>• Ignores numbers and special characters</li>
            <li>• Fallback to &quot;U&quot; for invalid or empty usernames</li>
            <li>• Uses CyLink brand colors (#2563EB background, white text)</li>
            <li>• Supports hover (#1D4ED8) and active (#1E40AF) states</li>
            <li>• Fully accessible with ARIA labels and keyboard navigation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarShowcase;
