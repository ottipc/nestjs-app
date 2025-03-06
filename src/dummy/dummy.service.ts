import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class DummyService {
  private readonly dummyBaseUrl = 'https://dummyjson.com';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAuthToken(loginDto: LoginDto): Promise<any> {
    const cachedToken = await this.cacheManager.get<string>('dummyToken');
    if (cachedToken) {
      return { token: cachedToken, cached: true };
    }
    try {
      const response = await this.httpService.axiosRef.post(`${this.dummyBaseUrl}/auth/login`, loginDto);
      const token = response.data.token;
      await this.cacheManager.set('dummyToken', token, 55 * 60);
      return { token, cached: false };
    } catch (error) {
      throw new InternalServerErrorException('Fehler beim Abrufen des Tokens: ' + (error as any).message);
    }
  }

  async getProducts(sort?: string, filter?: string): Promise<any> {
    const cachedProducts = await this.cacheManager.get<any>('dummyProducts');
    if (cachedProducts) {
      return this.applySortFilter(cachedProducts, sort, filter);
    }
    try {
      const response = await this.httpService.axiosRef.get(`${this.dummyBaseUrl}/products`);
      const products = response.data.products;
      await this.cacheManager.set('dummyProducts', products, 60 * 60);
      return this.applySortFilter(products, sort, filter);
    } catch (error) {
      throw new InternalServerErrorException('Fehler beim Abrufen der Produkte: ' + (error as any).message);
    }
  }

  private applySortFilter(products: any[], sort?: string, filter?: string): any[] {
    let result = products;
    if (filter) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(filter.toLowerCase()),
      );
    }
    if (sort) {
      if (sort === 'price') {
        result = result.sort((a, b) => a.price - b.price);
      } else if (sort === 'rating') {
        result = result.sort((a, b) => a.rating - b.rating);
      }
    }
    return result;
  }

  async processOrder(orderProducts: { id: number; count: number }[]): Promise<any> {
    if (!orderProducts || !orderProducts.length) {
      throw new InternalServerErrorException('Keine Produkte im Auftrag!');
    }
    let totalCost = 0;
    let totalRating = 0;
    let totalCount = 0;
    for (const item of orderProducts) {
      try {
        const response = await this.httpService.axiosRef.get(`${this.dummyBaseUrl}/products/${item.id}`);
        const product = response.data;
        totalCost += product.price * item.count;
        totalRating += product.rating * item.count;
        totalCount += item.count;
      } catch (error) {
        throw new InternalServerErrorException(`Fehler beim Abrufen von Produkt ID ${item.id}: ` + (error as any).message);
      }
    }
    const averageRating = totalCount ? totalRating / totalCount : 0;
    return { totalCost, averageRating };
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    // Simuliere die Benutzeranlage: generiere a zufällige ID und gib den neuen Benutzer zruck
    const newUser = { id: Math.floor(Math.random() * 10000), ...createUserDto };
    return newUser;
  }
}
