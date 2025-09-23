import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag className="h-8 w-8" />
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-xs text-muted-foreground">
              Orders over $100
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign className="h-8 w-8" />
            <div className="text-sm font-bold">Money Back Guarantee</div>
            <div className="text-xs text-muted-foreground">
              Within 30 day of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards className="h-8 w-8" />
            <div className="text-sm font-bold">Flexible Payment</div>
            <div className="text-xs text-muted-foreground">
              Pay with credit card, PayPal or COD
            </div>
          </div>
          <div className="space-y-2">
            <Headset className="h-8 w-8" />
            <div className="text-sm font-bold">24/7 Support</div>
            <div className="text-xs text-muted-foreground">
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
