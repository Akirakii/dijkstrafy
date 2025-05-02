# Dijkstrafy 🔍

**Dijkstrafy** is a visual interactive graph algorithm simulator built with **React** and **TypeScript**. It allows users to create nodes and edges, then run various shortest path algorithms such as:

- 🟢 **Dijkstra's Algorithm**
- 🟠 **Bellman-Ford Algorithm**
- 🔵 **SPFA (Shortest Path Faster Algorithm)**

The application provides real-time visual feedback as each algorithm progresses through the graph.

---

## 🌐 Live Demo

🎉 Try it out here:  
🔗 [https://akirakii.github.io/dijkstrafy/](https://akirakii.github.io/dijkstrafy/)

Explore, experiment, and enjoy learning about graphs with Dijkstrafy! 🚀

---

## ✨ Features

- **Visualize shortest path algorithms step-by-step**
- **Interactive node and edge creation**
- **Support for directed, weighted graphs**
- **Real-time highlighting of visited nodes, edges, and final path**
- **Pause and stop visualizations anytime**
- **Modern UI built with React + TypeScript**

---

## 📘 Beginner's Guide

Welcome to **Dijkstrafy**, a visual tool for learning **pathfinding algorithms** on **weighted directed graphs**. This guide is for users of all levels — no prior graph theory knowledge required!

---

### 🕹️ How to Use Dijkstrafy

1. **Left Click** anywhere on the board to **create a node**.
2. **Drag from one node to another** to create a **directed edge**.
3. **Click on an edge's weight number** to **edit** it.
4. **Right Click and hold** on a node to **delete** it.
5. Select a **start and end node** using the inputs.
6. Choose an **algorithm** from the dropdown.
7. Click ▶ to **run** the selected algorithm.
8. Click ⏹ to **stop** the visualization.
9. Click 🗑️ to **clear the graph**.

---

### ⚖️ What are Weighted Directed Graphs?

- A **graph** is made up of **nodes** (circles) and **edges** (arrows connecting nodes).
- A **directed graph** has **one-way edges** — like one-way roads.
- A **weighted graph** assigns a **cost or weight** to each edge — such as distance, time, or cost.

🧠 **Why it matters:**  
These weights are used to calculate the **shortest or cheapest path** between two nodes.

---

### 🔻 What are Negative Weights?

Some graphs include **negative weights** — for example, a reward, refund, or “gain” instead of a cost.

🚫 **Important Note:**  
Not all algorithms support **negative weights**, and they can lead to **negative cycles** — where the cost keeps decreasing forever.

---

### 🚦 Which Algorithms Support Negative Weights?

| Algorithm       | Supports Negative Weights? | Detects Negative Cycles? |
|----------------|-----------------------------|---------------------------|
| Dijkstra        | ❌ No                        | ❌ No                      |
| Bellman-Ford    | ✅ Yes                       | ✅ Yes                     |
| SPFA            | ✅ Yes                       | ❌ No (may loop forever)   |

> ✅ Use **Bellman-Ford** or **SPFA** if your graph includes negative weights.  
> ⚠️ Avoid **Dijkstra’s** on such graphs — results will be incorrect.

---

### 📚 Algorithms Explained

#### 1. **Dijkstra’s Algorithm**
- ✅ Fastest for graphs with **non-negative weights**
- 🔍 Picks the shortest known path at every step
- 📦 Used in: GPS, navigation, game AI

#### 2. **Bellman-Ford Algorithm**
- ✅ Handles **negative weights**
- 🛡️ Detects **negative weight cycles**
- 🐢 Slower than Dijkstra
- 📦 Used in: Network routing protocols (e.g., RIP)

#### 3. **SPFA (Shortest Path Faster Algorithm)**
- ✅ Handles **negative weights**
- 🚀 Often faster than Bellman-Ford on **sparse graphs**
- ❌ Doesn't detect negative cycles
- 📦 Great for real-time graph changes

---

### 🔍 Real-World Applications

- **Google Maps** / GPS Navigation
- **Network Routing** (e.g., internet protocols)
- **Video Game AI** (unit movement)
- **Finance** (arbitrage detection)
- **Robotics** (autonomous path planning)

---

### 🤔 Why Pathfinding?

Imagine needing to travel between two cities or send data across a network — you want the **cheapest**, **fastest**, or **shortest** route.  
That’s what **pathfinding algorithms** solve: finding the best route in a complex system of connections.

---

## 📦 Tech Stack

- ⚛️ React
- ⌨️ TypeScript
- 🎨 CSS Modules / Custom styling
- 📦 `gh-pages` for deployment

---

## 🚀 Local Setup

Clone the repo:

```bash
git clone https://github.com/akirakii/dijkstrafy.git
cd dijkstrafy
npm install
