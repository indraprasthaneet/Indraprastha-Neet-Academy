import React from 'react';

const SidebarTest = () => {
  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sidebar Overlay Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Layout Test</h2>
          <p className="text-gray-600 mb-4">
            This page is designed to test if the sidebar properly overlays without shifting the main content.
            The sidebar should appear on top of this content when opened, not push it to the right.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Test Card 1</h3>
              <p className="text-blue-600 text-sm">This content should not move when sidebar opens</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Test Card 2</h3>
              <p className="text-green-600 text-sm">Layout should remain stable</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Test Card 3</h3>
              <p className="text-purple-600 text-sm">Sidebar should overlay on top</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Open the sidebar using the toggle button</li>
            <li>Verify that this content does not shift to the right</li>
            <li>The sidebar should appear as an overlay on top of this content</li>
            <li>On mobile, the sidebar should have a backdrop overlay</li>
            <li>On desktop, the sidebar should simply appear on top</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SidebarTest;