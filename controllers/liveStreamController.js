const LIVEKIT_API_KEY = "APIGsgjgy3uBfYe";
const LIVEKIT_API_SECRET = "1ubeXhmB5G1KksCIceUJ4BewSf000UjyDRMot62fi7aG";

const { generateAccessToken } = require("../helper/generateAcToken");
const generateToken = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;
    const viewerToken = await generateAccessToken(roomName, participantName);
    res.json({ token: viewerToken });
  } catch (error) {
    console.error("Error generating viewer token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const broadCastToken = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({ error: "Both roomName and participantName are required in the request body" });
    }

    const broadcastToken = await generateAccessToken(roomName, participantName);
    res.json({ token: broadcastToken });
  } catch (error) {
    console.error("Error generating broadcast token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

class LiveKitService {
  static async fetchBroadcastedTracks(roomName) {
    const livekit = await import("livekit-server-sdk");
    const { RoomServiceClient } = livekit;
    const roomService = new RoomServiceClient("sohag", LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    console.log(roomService);
    const rooms = await roomService.listRooms();
    console.log(rooms, 222222222222);
    const room = rooms.find((r) => r.name === roomName);
    try {
      if (!room) {
        console.error("Room not found");
        return [];
      }
      console.log(room);

      const participants = await roomService.listParticipants(room.sid);

      const broadcastedTracks = participants
        .filter((participant) => participant.identity.startsWith("broadcast"))
        .flatMap((participant) => participant.tracks)
        .map((track) => ({ trackId: track.sid, kind: track.kind }));

      return broadcastedTracks;
    } catch (error) {
      console.error("Error fetching room:", error);
      throw error; // Propagate the error
    }
  }
}

const broadcastTrack = async (req, res) => {
  try {
    const { roomName } = req.body;
    const broadcastedTracks = await LiveKitService.fetchBroadcastedTracks(roomName);

    res.send({ tracks: broadcastedTracks });
  } catch (error) {
    console.error("Error fetching broadcasted tracks:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { generateToken, broadCastToken, broadcastTrack };
