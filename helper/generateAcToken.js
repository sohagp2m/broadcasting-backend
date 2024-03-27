const LIVEKIT_API_KEY = "APIGsgjgy3uBfYe";
const LIVEKIT_API_SECRET = "1ubeXhmB5G1KksCIceUJ4BewSf000UjyDRMot62fi7aG";

async function generateAccessToken(roomName, participantName) {
  try {
    // Import livekit-server-sdk using dynamic import
    const livekit = await import("livekit-server-sdk");
    const { AccessToken } = livekit;

    const accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: participantName,
    });

    accessToken.addGrant({ roomJoin: true, room: roomName });
    return await accessToken.toJwt();
  } catch (error) {
    console.error("Error importing livekit-server-sdk:", error);
    throw error; // Propagate the error
  }
}

module.exports = { generateAccessToken };
