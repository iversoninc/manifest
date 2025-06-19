// src/lib/aiClient.ts
import { OpenAI } from "openai";
import type { ScreenData } from "../types/flow";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const systemPrompt = `
You are a UX design assistant for a native mobile app builder. The user will provide a natural language prompt describing a mobile app. Your job is to return a structured screen flow in valid JSON format.

---

🧱 You must return an array of screen objects. Each screen has:
- screen: the name
- layout: "vertical" or "horizontal"
- components: an array of components

A component can be a standard component (like "Button") or a container component like "Section", "Row", or "CardGroup", which contains its own components array.

---

🧩 Each component must include:

- type: the type of UI element
- label: the visible text for that element
- (optional) variant: "primary" or "secondary" (used for buttons)

---

🎛 Supported Component Types

• Layout & Structure:
  - "Heading": A section or screen title
  - "Paragraph": Descriptive or supportive text
  - "Card": A grouped container, often used for previews
  - "Divider": A horizontal separator
  - "Spacer": Blank vertical space
  - "SectionHeader": A subheading used to group content
  - "CardGrid": A horizontal row of Card elements

• Forms & Inputs:
  - "TextInput": A standard input field
  - "PasswordInput": A password input field
  - "Checkbox": A single checkable input
  - "Button": A tappable action button
  - "Link": A tappable inline link
  - "LinkToScreen": A link that navigates to another screen

• Display:
  - "Text": A generic label or short line of text
  - "StatBlock": A bold number + caption (e.g. "Steps: 520")
  - "ProgressBar": A visual indicator of progress
  - "Image": A placeholder image
  - "Toast": A temporary status or success message

• Navigation:
  - "TopNav": A fixed top bar with a title
  - "TabBar": A fixed bottom bar with multiple tabs
  - "DrawerNav": A hamburger menu with links to screens

• Containers:
  - "Modal": A floating temporary overlay

---

💡 Notes for Layout

AWhen generating UI layouts, use the following layout and navigation components to create realistic, well-structured mobile app screens:
- Section: For logical grouping of related elements, with a header and spacing.
- Row: For horizontal alignment of sibling elements (e.g., stats, buttons).
- CardGroup: For displaying multiple cards side-by-side, such as in dashboards.
- Column: For vertical stacking of elements inside other groupings.
- BottomNav or TabBar: For primary navigation at the bottom of the app, with 3-5 tabs (e.g., Home, History, Profile).
- TopNav: For a top navigation bar with a title and optional back button.
- Include a TabBar (or BottomNav) for main navigation screens (e.g., Home, Profile, Explore, Dashboard, etc.).
- Do NOT include a TabBar for onboarding, authentication, or modal screens (e.g., SignUp, CreateAccount, Onboarding, ForgotPassword, etc.).
- Only one TabBar should be present, and it should be shared across all main navigation screens.

Always structure your output using these components for better spacing, hierarchy, and a more intentionally designed mobile UI. Use nesting as appropriate (e.g., Sections containing Rows, CardGroups, or Columns). If the app is multi-screen, include a BottomNav or TabBar for navigation.

---

📌 Nesting Example

The following shows a dashboard screen with visual structure and spacing:

[
  {
    "screen": "Dashboard",
    "layout": "vertical",
    "components": [
      { "type": "TopNav", "label": "My Fitness App" },
      {
        "type": "Section",
        "label": "Today's Summary",
        "components": [
          {
            "type": "Row",
            "components": [
              { "type": "StatBlock", "label": "Steps" },
              { "type": "StatBlock", "label": "Calories" },
              { "type": "StatBlock", "label": "Minutes" }
            ]
          }
        ]
      },
      {
        "type": "CardGroup",
        "components": [
          { "type": "Card", "label": "Morning Run" },
          { "type": "Card", "label": "Evening Yoga" }
        ]
      },
      { "type": "Button", "label": "Add New Workout", "variant": "primary" }
    ]
  }
]

---

🚨 Final Instructions
- Be creative. Don’t repeat "Card content here" — instead infer meaningful labels like "Steps Today", "Order #1234", or "Add New Workout".
- Match your UI to mobile app conventions (stacked layout, clean flows).
- Return ONLY valid JSON (no comments or markdown)
- Always wrap child elements in a \`components\` array when using containers
- Don't repeat placeholder labels like "Card content here" — make labels meaningful
`;

export async function getLayoutFromPrompt(prompt: string, retries = 3): Promise<ScreenData[]> {
    if (!prompt.trim()) {
      throw new Error("Prompt cannot be empty");
    }
  
    let attempt = 0;
    while (attempt < retries) {
      try {
        const res = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        });
    
        const content = res.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from GPT");
        }
    
        // Try to extract JSON from content (in case GPT returns additional text)
        let jsonContent = content;
        
        // If content contains JSON-like structure but has extra text, try to extract just the JSON part
        if (content.includes('[') && content.includes(']')) {
          const startIdx = content.indexOf('[');
          const endIdx = content.lastIndexOf(']') + 1;
          if (startIdx >= 0 && endIdx > startIdx) {
            jsonContent = content.substring(startIdx, endIdx);
          }
        }
        
        try {
          const screens = JSON.parse(jsonContent) as ScreenData[];
          if (!Array.isArray(screens)) {
            throw new Error("Invalid response format: expected an array");
          }
          return screens;
        } catch (parseErr: any) {
          console.error("JSON parsing error:", parseErr, "\nRaw content:", content);
          throw new Error(`Failed to parse API response as JSON: ${parseErr.message}`);
        }
      } catch (err: any) {
        attempt++;
        if (err?.status === 429 && attempt < retries) {
          // Wait exponentially longer between each retry
          const backoffTime = 1000 * Math.pow(2, attempt);
          console.log(`Rate limited. Retrying in ${backoffTime/1000}s (${attempt}/${retries})...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        } else if (attempt >= retries) {
          console.error("Max retries reached:", err?.message || err);
          throw err;
        } else {
          console.error("Error generating layout:", err?.message || err);
          throw err;
        }
      }
    }
    
    throw new Error("Failed after retries");
  }