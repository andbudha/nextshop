import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { Menu } from 'lucide-react';
import Link from 'next/link';

const CategoryDrawer = async () => {
  const categoies = await getAllCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select Category</DrawerTitle>
          <div className="space-y-1 mt-2">
            {categoies.map((x) => (
              <div key={x.category}>
                <Button
                  variant={'ghost'}
                  className="w-full justify-start"
                  asChild
                >
                  <DrawerClose asChild>
                    <Link href={`/search?category=${x}`}>
                      {x.category} ({x.count})
                    </Link>
                  </DrawerClose>
                </Button>
              </div>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
