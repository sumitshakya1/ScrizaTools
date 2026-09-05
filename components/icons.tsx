import React from "react";
import {
  Maximize2,
  Minimize2,
  Layers,
  RefreshCw,
  Crop,
  FileImage,
  Clock,
  Mail,
  LayoutTemplate,
  Send,
  Bell,
  Workflow,
  Zap,
  ShieldCheck,
  Sparkles,
  Gauge,
  FileText,
  FileCode2,
  Code2,
  FolderArchive,
  Wrench,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Check,
  Sliders,
  Play,
  Filter,
  Users,
  Inbox,
  Lock,
  Smile,
  LucideProps,
  Image as ImageIcon,
  Images,
  Scan,
  Wand2,
} from "lucide-react";

export interface IconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: IconProps) {
  switch (name) {
    case "Maximize2":
      return <Maximize2 {...props} />;
    case "Minimize2":
      return <Minimize2 {...props} />;
    case "Layers":
      return <Layers {...props} />;
    case "RefreshCw":
      return <RefreshCw {...props} />;
    case "Crop":
      return <Crop {...props} />;
    case "FileImage":
      return <FileImage {...props} />;
    case "Clock":
      return <Clock {...props} />;
    case "Mail":
      return <Mail {...props} />;
    case "LayoutTemplate":
      return <LayoutTemplate {...props} />;
    case "Send":
      return <Send {...props} />;
    case "Bell":
      return <Bell {...props} />;
    case "Workflow":
      return <Workflow {...props} />;
    case "Zap":
      return <Zap {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Gauge":
      return <Gauge {...props} />;
    case "FileText":
      return <FileText {...props} />;
    case "FileCode2":
      return <FileCode2 {...props} />;
    case "Code2":
      return <Code2 {...props} />;
    case "FolderArchive":
      return <FolderArchive {...props} />;
    case "Wrench":
      return <Wrench {...props} />;
    case "TrendingUp":
      return <TrendingUp {...props} />;
    case "ArrowRight":
      return <ArrowRight {...props} />;
    case "ChevronRight":
      return <ChevronRight {...props} />;
    case "CheckCircle2":
      return <CheckCircle2 {...props} />;
    case "Check":
      return <Check {...props} />;
    case "Sliders":
      return <Sliders {...props} />;
    case "Play":
      return <Play {...props} />;
    case "Filter":
      return <Filter {...props} />;
    case "Users":
      return <Users {...props} />;
    case "Inbox":
      return <Inbox {...props} />;
    case "Lock":
      return <Lock {...props} />;
    case "Smile":
      return <Smile {...props} />;
    case "Image":
    case "ImageIcon":
      return <ImageIcon {...props} />;
    case "Images":
      return <Images {...props} />;
    case "Scan":
      return <Scan {...props} />;
    case "Wand2":
      return <Wand2 {...props} />;
    default:
      return <Sparkles {...props} />;
  }
}
