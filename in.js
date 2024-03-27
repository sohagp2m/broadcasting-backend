const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());

const live = async () => {
  const livekit = await import("livekit-server-sdk");
  const { EgressClient, EncodedFileOutput, S3Upload, RoomService } = livekit;
  return { EgressClient, EncodedFileOutput, S3Upload, RoomService };
};

const LIVEKIT_API_KEY = "APIGsgjgy3uBfYe";
const LIVEKIT_API_SECRET = "1ubeXhmB5G1KksCIceUJ4BewSf000UjyDRMot62fi7aG";

app.post("/startRoomCompositeEgress", async (req, res) => {
  try {
    const { EgressClient, EncodedFileOutput, S3Upload } = live();
    const { roomName } = req.body;

    const egressClient = new EgressClient("https://my-livekit-host", LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

    const fileOutput = new EncodedFileOutput({
      filepath: `livekit-demo/${roomName}-composite.mp4`,
      output: {
        case: "s3",
        value: new S3Upload({
          accessKey: "aws-access-key",
          secret: "aws-access-secret",
          region: "aws-region",
          bucket: "my-bucket",
        }),
      },
    });

    const info = await egressClient.startRoomCompositeEgress(roomName, { file: fileOutput }, { layout: "grid" });

    res.json({ success: true, egressId: info.egressId });
  } catch (error) {
    console.error("Error starting RoomComposite Egress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/createRoom", async (req, res) => {
  try {
    const { RoomService } = live();
    const roomService = new RoomService(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

    const { roomName } = req.body;
    const room = await roomService.createRoom({ name: roomName });
    res.json({ success: true, room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
