import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { Tag as TagIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Storefront as StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'tag': TagIcon,
  'user': UserIcon,
  'storefront': StorefrontIcon
} as Record<string, Icon>;
