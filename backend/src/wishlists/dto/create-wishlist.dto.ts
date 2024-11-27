import {
  IsArray,
  IsInt,
  IsUrl,
  Length,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description: string;
}
