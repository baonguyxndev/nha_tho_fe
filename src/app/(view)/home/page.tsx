// src/app/home.tsx (hoặc src/pages/home.tsx)
import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React from "react";

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="Fullstack Next/Nest - createdBy @hoidanit"
      />
    </div>
  );
};

export default HomePage;
