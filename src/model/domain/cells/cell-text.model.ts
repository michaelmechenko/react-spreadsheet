/**
 * This class represents the aesthetics of a spreadsheet cell. 
 * This includes feautures like font, size, italics, bold, underline, and text color.
 * A Builder design pattern was implemented to easily modify this object.
 * Unfortunately, this is not fully implemented in the application.
 */
export class CellText {

    // eslint-disable-next-line @typescript-eslint/typedef
    public static Builder = class Builder {

    private _font: string = 'default'; 
    private _size: number = 6;
    private _italics: boolean = false;
    private _bold: boolean = false;
    private _underline: boolean = false;
    private _color: string = 'black'; 

    public withFont(font: string): Builder {
      this._font = font;
      return this;
    }

    public withSize(size: number): Builder {
      this._size = size;
      return this;
    }

    public withItalics(isItalics: boolean): Builder {
      this._italics = isItalics;
      return this;
    }

    public withBold(isBold: boolean): Builder {
      this._bold = isBold;
      return this;
    }

    public withUnderline(isUnderline: boolean): Builder {
      this._underline = isUnderline;
      return this;
    }

    public withColor(color: string): Builder {
        this._color = color;
        return this;
      }
  

    public build(): CellText {
      return new CellText(
        this._font,
        this._size,
        this._italics,
        this._bold,
        this._underline,
        this._color,
      );
    }
  };

  public constructor(
    private _font: string,
    private _size: number,
    private _italics: boolean,
    private _bold: boolean,
    private _underline: boolean,
    private _color: string,
  ) {}

  public get font(): string {
    return this._font;
  }

  public get size(): number {
    return this._size;
  }
  
  public get italics(): boolean {
    return this._italics;
  }

  public get bold(): boolean {
    return this._bold;
  }

  public get underline(): boolean {
    return this._underline;
  }

  public get color(): string {
    return this._color;
  }

  public set font(font: string) {
    this._font = font;
  }

  public set size(size: number) {
    this._size = size;
  }
  
  public set italics(isItalics: boolean) {
    this._italics = isItalics;
  }

  public set bold(isBold: boolean) {
    this._bold = isBold;
  }

  public set underline(isUnderline: boolean) {
    this._underline = isUnderline;
  }

  public set color(color: string) {
    this._color = color;
  }
}