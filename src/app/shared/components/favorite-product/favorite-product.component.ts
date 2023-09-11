import {Component, Input, OnInit} from '@angular/core';
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CartType} from "../../../../types/cart.type";
import {FavoriteService} from "../../services/favorite.service";
import {CartService} from "../../services/cart.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit{
  @Input() product!: FavoriteType;
  constructor(private favoriteService: FavoriteService, private cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error((cartData as DefaultResponseType).message);
        }
        const cartDataResponse = cartData as CartType;
        if (cartDataResponse) {
          this.products.forEach(item => {
            const productInCart = cartDataResponse.items.find(product => product.product.id === item.id);
            if (productInCart) {
              item.countInCart = productInCart.quantity;
              this.count = item.countInCart;
              console.log(this.count, item.name)
            }
          })
        }
      });
  }
  count: number = 1;
  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  removeFromCartFavorites(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = 0;
        this.count = 1;
      })
  }

  updateCount(id: string, count: number) {
    this.product.countInCart = this.count;
    if (this.product.countInCart) {
      this.cartService.updateCart(id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.countInCart = count;
        })
    }
  }

  addToCart(id: string) {
    this.product.countInCart = this.count;
    this.cartService.updateCart(id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.product.countInCart = this.count;
      })
  }

}
