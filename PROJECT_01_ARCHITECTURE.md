# Project 01 — Architecture Document

**Status:** Defined by Claude (Architect + QA)
**Date:** 2026-05-04
**Cycle:** 1

---

## 1. Project Name

**Salah Time** — เว็บแอพแสดงเวลาละหมาดประจำวัน

---

## 2. Product Objective

สร้างเว็บแอพหน้าเดียวที่แสดงเวลาละหมาด 5 เวลาประจำวัน
โดยตรวจสอบตำแหน่งผู้ใช้อัตโนมัติ หรือให้ผู้ใช้ระบุเมือง

ไม่มี backend, ไม่มี login, ไม่มี database
ทำงานได้ด้วยการเปิด HTML ไฟล์เดียว หรือ deploy บน static host

---

## 3. Repository Structure

```
salah-time/                        ← repo แยกจาก agentflow
├── index.html                     ← entry point (TASK-P01-001)
├── style.css                      ← styling (TASK-P01-001)
├── app.js                         ← logic + API call (TASK-P01-002)
└── tests/
    └── app.test.js                ← unit tests (TASK-P01-003+)
```

AgentFlow repo (`agentflow/`) ทำหน้าที่จัดการ task เท่านั้น ไม่มี application code

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Language | HTML + CSS + Vanilla JS | ไม่มี build tools, Codex implement ง่าย, test ง่าย |
| Prayer Times API | Aladhan API (aladhan.com) | ฟรี, ไม่ต้อง auth, rองรับ lat/lon และชื่อเมือง |
| Location | Browser Geolocation API | built-in, ไม่ต้องติดตั้งอะไร |
| Deployment | Static file (GitHub Pages / any host) | ไม่ต้อง server |
| Test runner | Playwright หรือ manual browser check | ตรวจ UI ง่าย, ไม่มี build step |

---

## 5. Aladhan API — Reference

```
GET https://api.aladhan.com/v1/timingsByCity?city=Bangkok&country=TH&method=11
GET https://api.aladhan.com/v1/timings?latitude=13.75&longitude=100.51&method=11
```

method=11 = Muslim World League (ใช้กับประเทศไทย/เอเชียตะวันออกเฉียงใต้)

Response fields ที่ใช้:
- `data.timings.Fajr` — ซุบฮ์
- `data.timings.Dhuhr` — ซุฮ์ร
- `data.timings.Asr` — อัศร์
- `data.timings.Maghrib` — มัฆริบ
- `data.timings.Isha` — อิชาอ์

---

## 6. UI Requirements

- แสดงชื่อเมือง / วันที่ปัจจุบัน
- แสดงเวลาละหมาด 5 เวลา พร้อมชื่อภาษาไทยและ/หรืออาหรับ
- Highlight เวลาถัดไปที่ใกล้ที่สุด
- ถ้า geolocation ไม่ได้รับอนุญาต → แสดง input ให้กรอกชื่อเมือง
- Responsive (ใช้งานได้บนมือถือ)

---

## 7. Build Order

| Task ID | Title | Deliverable |
|---|---|---|
| TASK-P01-001 | HTML/CSS Scaffold | index.html + style.css — static layout ไม่มี JS |
| TASK-P01-002 | Fetch + Display Prayer Times | app.js — เรียก Aladhan API แสดงเวลา |
| TASK-P01-003 | Geolocation + City Fallback | ตรวจ geolocation, fallback input |
| TASK-P01-004 | Highlight Next Prayer | highlight เวลาที่ใกล้ที่สุด |
| TASK-P01-005 | Responsive + Final Polish | mobile layout, error states |

---

## 8. Leantime Setup

### Project
- สร้าง project ใหม่ใน Leantime ชื่อ: **Salah Time**
- เชื่อมกับ AgentFlow ผ่าน API key: `agentflow`

### Task Status Flow (ตั้งใน Leantime)

| Status Label | ความหมายใน AgentFlow |
|---|---|
| Backlog | รอวางแผน |
| **Ready** | ✅ Trigger — Codex รับ task นี้ได้ |
| In Progress | Codex กำลัง implement |
| Ready for Review | Codex เสร็จ รอ Claude review |
| Defect Found | Claude พบ defect |
| Fixing | Codex กำลังแก้ defect |
| Ready for Approval | Claude PASS รอ Human อนุมัติ |
| Done | Human อนุมัติแล้ว |

---

## 9. n8n Workflow Design

### Workflow: AgentFlow — Task Dispatcher

```
[Schedule Trigger]     ← ทุก 5 นาที (auto)
      OR
[Webhook / Manual]     ← fallback ถ้า auto พัง

        ↓

[HTTP Request]
GET Leantime tasks ที่ status = "Ready"
Project = Salah Time

        ↓

[IF] มี task หรือไม่?
  ├── NO  → Stop
  └── YES ↓

[Set Node] แปลง task เป็น AgentFlow payload format

        ↓

[HTTP Request / Webhook]
ส่ง task ไปให้ Codex

        ↓

[HTTP Request]
UPDATE task status → "In Progress" ใน Leantime
```

### Manual Fallback
- n8n Workflow มี Webhook node เพิ่มเติม (disabled ปกติ)
- เปิดใช้งานได้จาก n8n UI เมื่อ schedule พัง
- หรือกด "Execute workflow" จาก n8n dashboard โดยตรง

---

## 10. Open Items — ปิดแล้ว

| Item | Status |
|---|---|
| Leantime URL | ✅ `https://project.cocofriday.com` |
| Leantime version | ✅ V3.6.2 |
| API endpoint | ✅ `/api/jsonrpc/` JSON-RPC 2.0 |
| n8n instance | ✅ `ai.cocofriday.com` |
| Project name | ✅ Salah Time |
| Tech stack | ✅ HTML + CSS + Vanilla JS |
| Prayer API | ✅ Aladhan API |
| n8n trigger | ✅ Schedule 5 min + Manual fallback |

---

## 11. First Task Ready

**TASK-P01-001** — HTML/CSS Scaffold
See: `tasks/TASK-P01-001.md`

ห้าม implement TASK-P01-002 จนกว่า TASK-P01-001 จะผ่าน Claude review และ Human อนุมัติ
