# MediaMTX RTSP Simulator

A lightweight RTSP camera simulation tool built around **MediaMTX + FFmpeg**.  
Designed for Field Application Engineers (FAE) and remote testing scenarios to reproduce client environments without physical cameras.

This tool converts local video files into RTSP streams that behave like IP cameras.

---

## ✨ Features

- 🎥 Simulate multiple IP cameras from video files
- 🚀 No system-wide installation required
- 🔒 Client-safe (no automatic package installation)
- 📦 Portable — can run from any directory
- ⚡ Uses MediaMTX (formerly rtsp-simple-server)
- 🔁 Infinite loop playback
- 🧩 Auto-generates RTSP configuration
- 🖥️ Ideal for VMS testing (Nx Witness, Milestone, etc.)

---

## 🧱 Requirements

Install manually (see `note.txt` for quick commands):

- Linux (tested on Ubuntu)
- FFmpeg
- MediaMTX binary
- Node.js ≥ 18 (optional, for config generation)

---

## ⚙️ Configuration

Edit **config.json**

```json
{
  "rtspHost": "192.168.1.100",
  "rtspPort": 8554
}
```

---

## 🎬 Add Video Files

Place MP4 files inside:

```
videos/
```

Example:

```
videos/
  01.mp4
  02.mp4
```

Each file becomes one RTSP stream.

---

## 🧪 Generate RTSP Configuration

```bash
node run.js config
```

Creates:

```
rtsp.yml
```

---

## ▶️ Start RTSP Server

```bash
node run.js rtsp
```

MediaMTX will start using the generated configuration.

---

## 📡 Stream URLs

Streams follow this pattern:

```
rtsp://<host>:<port>/cam1
rtsp://<host>:<port>/cam2
rtsp://<host>:<port>/cam3
```

Example:

```
rtsp://192.168.1.100:8554/cam1
```

---

## 🧪 Testing Streams

Recommended tools:

### VLC

```
Media → Open Network Stream
```

### FFplay (most reliable)

```bash
ffplay -rtsp_transport tcp rtsp://192.168.1.100:8554/cam1
```

---

## 🧹 Manual Installation Guide

See:

```
note.txt
```

Contains quick commands for installing:

* NVM / Node
* FFmpeg
* MediaMTX

---

## ⚠️ Notes

* Only MP4 files are supported for maximum compatibility.
* Streams loop indefinitely.
* No audio is transmitted.
* Designed for LAN testing environments.
* Does not modify system configuration.

---

## 🛠️ Use Cases

* Remote client environment reproduction
* VMS integration testing
* AI / analytics validation
* Load testing with multiple cameras
* Demo environments without hardware

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Alejandrocsdev

---

## ❤️ Acknowledgements

* https://github.com/bluenviron/mediamtx
* https://ffmpeg.org/
