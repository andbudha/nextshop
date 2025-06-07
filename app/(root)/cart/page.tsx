import { getMyCart } from '@/lib/actions/cart.actions';
import CartTable from './cart-table';

export const metadata = {
  title: 'Cart',
};
const CartPage = async () => {
  //ge cart
  const cart = await getMyCart();
  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
