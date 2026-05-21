import React from "react";
import { Controller } from "react-hook-form";

function RTE({ name, control, label }) {
  return (
    <div>
      {label && <label className="block mb-2">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <textarea
            {...field}
            className="w-full h-40 border rounded p-2"
            placeholder="Write your content..."
          />
        )}
      />
    </div>
  );
}

export default RTE;