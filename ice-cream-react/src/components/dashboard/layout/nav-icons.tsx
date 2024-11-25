import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { Basket as BasketIcon } from '@phosphor-icons/react/dist/ssr/Basket';
import { Tag as TagIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Storefront as StorefrontIcon } from '@phosphor-icons/react/dist/ssr/Storefront';
import { Briefcase as BriefcaseIcon} from '@phosphor-icons/react/dist/ssr/Briefcase';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'basket': BasketIcon,
  'tag': TagIcon,
  'user': UserIcon,
  'storefront': StorefrontIcon,
  'briefcase': BriefcaseIcon
} as Record<string, Icon>;
