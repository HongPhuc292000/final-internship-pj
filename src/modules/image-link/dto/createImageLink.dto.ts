import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ImageLinkDto {
  @IsNotEmpty()
  @MaxLength(30)
  imageUrl: string;

  @IsOptional()
  productId: string;
}

export class CreateImageLinkDto {
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  imageUrls: string[];
}
