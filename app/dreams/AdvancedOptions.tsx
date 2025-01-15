"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useBookData } from "./BookData";

const AdvancedOptions = () => {
  const {
    colorTheme,
    setColorTheme,
    imageStyleStrength,
    setImageStyleStrength,
    imageResolution,
    setImageResolution,
  } = useBookData();

  return (
    <Card className="bg-[#0c1b2d] border-blue-500/20 p-6 space-y-6 my-5">
      <h2 className="text-lg font-semibold text-white">Advanced Options</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-blue-200 mb-2 block">
            Color Theme
          </label>
          <Select value={colorTheme} onValueChange={setColorTheme}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100">
              <SelectValue placeholder="Select a color theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vibrant">Vibrant</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-blue-200 mb-2 block">
            Image Style Strength
          </label>
          <Slider
            value={[imageStyleStrength]}
            onValueChange={([value]) => setImageStyleStrength(value)}
            defaultValue={[50]}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="text-xs text-blue-200 mt-1">
            {imageStyleStrength}%
          </div>
        </div>
        <div>
          <label className="text-sm text-blue-200 mb-2 block">
            Image Resolution
          </label>
          <Select value={imageResolution} onValueChange={setImageResolution}>
            <SelectTrigger className="bg-[#0a1525] border-blue-500/20 text-blue-100">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (512x512)</SelectItem>
              <SelectItem value="hd">HD (1024x1024)</SelectItem>
              <SelectItem value="ultra">Ultra HD (2048x2048)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedOptions;
