import { getNextLetterNumber } from "@/lib/firebase";

/**
 * This is a test component to verify the letter numbering functionality.
 * You can add this to a test page or run it in a development environment.
 */
const LetterNumberingTest = () => {
  const testLetterNumbering = async () => {
    try {
      console.log("Testing letter numbering for domisili template...");
      const domisiliNumber = await getNextLetterNumber("domisili");
      console.log("Generated number for domisili:", domisiliNumber);
      
      console.log("Testing letter numbering for usaha template...");
      const usahaNumber = await getNextLetterNumber("usaha");
      console.log("Generated number for usaha:", usahaNumber);
      
      return { domisiliNumber, usahaNumber };
    } catch (error) {
      console.error("Error testing letter numbering:", error);
      return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Letter Numbering Test</h1>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={async () => {
          const result = await testLetterNumbering();
          if (result) {
            alert(`Domisili: ${result.domisiliNumber}\nUsaha: ${result.usahaNumber}`);
          } else {
            alert("Test failed. Check console for errors.");
          }
        }}
      >
        Test Letter Numbering
      </button>
      <p className="mt-4 text-sm text-gray-600">
        This will increment the counters in Firestore. Check the console for detailed output.
      </p>
    </div>
  );
};

export default LetterNumberingTest;