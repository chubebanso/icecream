'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({});
  const [username, setUsername] = React.useState<string>(''); // State để lưu username

  // Hàm toggle mở/đóng dropdown dựa trên key của mục
  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Hàm để lấy user từ backend (http://localhost:8080/all-user)
  const fetchUser = async () => {
    try {
      // Gọi API lấy thông tin user
      const response = await fetch('http://localhost:8080/all-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.data[0]; // Giả sử bạn muốn lấy người dùng đầu tiên trong mảng data
        setUsername(user.username); // Lấy username từ API
      } else {
        console.error("Error fetching users:", response.statusText);
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername); // Nếu không lấy được từ API, dùng dữ liệu từ localStorage
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername); // Nếu không lấy được từ API, dùng dữ liệu từ localStorage
      }
    }
  };

  // Gọi fetchUser khi component được render
  React.useEffect(() => {
    fetchUser(); // Lấy dữ liệu người dùng
  }, []); // Chạy một lần khi component được render

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'black',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '110%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: '350x', // Điều chỉnh chiều rộng sidebar
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={32} width={122} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Chào mừng
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              {username || 'Đỗ Quang Minh'} {/* Nếu username không có, hiển thị tên mặc định */}
            </Typography>
          </Box>
          <CaretUpDownIcon />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{
        width: '260px', // Độ rộng của side-nav
        flexShrink: 0,
      }} >
        {renderNavItems({ pathname, items: navItems, openDropdowns, toggleDropdown })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Stack spacing={2} sx={{ p: '12px' }}>
        <div>
          <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2">
            Vì tổ quốc xã hội chủ nghĩa
          </Typography>
          <Typography color="white" variant="body2">
            <b>Hãy làm việc cống hiến cho nước nhà</b>
          </Typography>
        </div>
      </Stack>
    </Box>
  );
}

// Giữ lại phần renderNavItems và NavItem như trong mã của bạn

function renderNavItems({
  items = [],
  pathname,
  openDropdowns,
  toggleDropdown,
}: {
  items?: NavItemConfig[];
  pathname: string;
  openDropdowns: Record<string, boolean>;
  toggleDropdown: (key: string) => void;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, children, ...item } = curr;

    // Kiểm tra xem có mục con hay không
    const hasChildren = Boolean(children?.length);
    const isDropdownOpen = openDropdowns[key] || false;

    acc.push(
      <React.Fragment key={key}>
        <NavItem
          key={key} // Thêm thuộc tính này
          pathname={pathname}
          {...item}
          onClick={hasChildren ? () => toggleDropdown(key) : undefined}
          showDropdownIcon={hasChildren}
          isDropdownOpen={isDropdownOpen}
        />
        {hasChildren && isDropdownOpen && (
          <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: '0 0 0 20px' }}>
            {children?.map((child) => {
              const { key, ...rest } = child; // Loại bỏ 'key' khỏi spread operator
              return (
                <NavItem key={key} pathname={pathname} {...rest} />
              );
            })}
          </Stack>
        )}
      </React.Fragment>
    );


    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  key: string; // Thêm dòng này
  pathname: string;
  onClick?: () => void;
  showDropdownIcon?: boolean;
  isDropdownOpen?: boolean;
}


function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  onClick,
  showDropdownIcon,
  isDropdownOpen,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li onClick={onClick}>
      <Box
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
        {/* Hiển thị biểu tượng mũi tên nếu có mục con */}
        {showDropdownIcon && (
          <CaretUpDownIcon
            style={{
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        )}
      </Box>
    </li>
  );
}
