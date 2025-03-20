class Test {
  #name;
  get dog() {
    return this.#name;
  }
  set dog(name) {
    this.#name = name;
  }

  info() {
    this.dog = "moti";
    console.log(this.dog);
  }
}

new Test().info();
