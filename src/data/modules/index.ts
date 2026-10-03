import type { RoadmapModule } from "@/types/index.ts";
import { frontendModules } from "@/data/modules/frontend.ts";
import { uiuxModules } from "@/data/modules/uiux.ts";
import { web3Modules } from "@/data/modules/web3.ts";

export const modules: RoadmapModule[] = [...frontendModules, ...uiuxModules, ...web3Modules];
