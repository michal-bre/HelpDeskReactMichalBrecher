import React from "react";
import { Box } from "@mui/material";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fcfdfe" }}>
      {/* הסיידבר יושב בצד */}
      <Sidebar />

      {/* התוכן הראשי מתחיל רק אחרי הסיידבר */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${DRAWER_WIDTH}px`, // זה מה שמונע מהסיידבר לעלות על הדף
          p: 6, // רווח פנימי גדול ויוקרתי
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;