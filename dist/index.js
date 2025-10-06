"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/book-now-links.ts
  var bookLinks_func = () => {
    const bookLinks_el = document.querySelectorAll("[book-now-button]");
    console.log("\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043A\u043D\u043E\u043F\u043E\u043A:", bookLinks_el.length);
    const slugify = (s) => s.trim().toLowerCase().replace(/\s+/g, "-");
    let currentCity = null;
    try {
      const saved = sessionStorage.getItem("savedCity");
      if (saved)
        currentCity = slugify(saved);
    } catch {
    }
    if (!currentCity) {
      const m = window.location.pathname.match(/(?:\/city\/|\/|-)([a-z0-9\-]+)(?:$|\/)/i);
      if (m)
        currentCity = slugify(m[1]);
    }
    if (!currentCity) {
      const attr = document.body.getAttribute("this-is-a-city-page");
      if (attr)
        currentCity = slugify(attr);
    }
    console.log("\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0433\u043E\u0440\u043E\u0434:", currentCity ?? "(\u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D)");
    if (bookLinks_el.length) {
      bookLinks_el.forEach((elButton) => {
        const linkFromAtribute = elButton.getAttribute("book-now-button");
        const priceFromAttribute = elButton.getAttribute("price-info");
        if (linkFromAtribute) {
          const atribute_linksItemsList_readyFalse = linkFromAtribute.split(";").filter((item) => item.trim() !== "");
          console.log("\u0421\u043F\u0438\u0441\u043E\u043A \u043D\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0445 \u0441\u0441\u044B\u043B\u043E\u043A:", atribute_linksItemsList_readyFalse);
          atribute_linksItemsList_readyFalse.forEach((el) => {
            console.log("\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0438:", el);
            const part_first = slugify(el.split("@")[0]);
            const part_second = el.split("@")[1];
            console.log("\u0427\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0432\u0430\u044F (\u0433\u043E\u0440\u043E\u0434):", part_first);
            console.log("\u0427\u0430\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0430\u044F (\u0441\u0441\u044B\u043B\u043A\u0430):", part_second);
            if (currentCity && part_first === currentCity) {
              elButton.setAttribute("href", part_second);
              elButton.classList.remove("hide");
              console.log("\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D href:", part_second, "\u0434\u043B\u044F \u043A\u043D\u043E\u043F\u043A\u0438:", elButton);
            }
          });
        } else {
          console.warn("\u0410\u0442\u0440\u0438\u0431\u0443\u0442 book-now-button \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0443 \u043A\u043D\u043E\u043F\u043A\u0438:", elButton);
        }
        if (priceFromAttribute) {
          const priceItemsList_readyFalse = priceFromAttribute.split(";").filter((item) => item.trim() !== "");
          console.log("\u0421\u043F\u0438\u0441\u043E\u043A \u043D\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0445 \u0446\u0435\u043D:", priceItemsList_readyFalse);
          priceItemsList_readyFalse.forEach((priceEl) => {
            const price_city = slugify(priceEl.split("@")[0]);
            const price_value = priceEl.split("@")[1];
            console.log("\u0427\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0432\u0430\u044F (\u0433\u043E\u0440\u043E\u0434):", price_city);
            console.log("\u0427\u0430\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0430\u044F (\u0446\u0435\u043D\u0430):", price_value);
            if (currentCity && price_city === currentCity) {
              elButton.setAttribute("data-price", price_value);
              const parentWithPriceText = elButton.closest(".exp-slider_title-wrapper")?.querySelector("[data-price-text]");
              if (parentWithPriceText) {
                parentWithPriceText.setAttribute("data-price-text", price_value);
                parentWithPriceText.textContent = price_value;
                console.log(
                  "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0446\u0435\u043D\u0430:",
                  price_value,
                  "\u0432 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u043C \u0431\u043B\u043E\u043A\u0435:",
                  parentWithPriceText
                );
              } else {
                console.log("\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0441 data-price-text \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
              }
            }
          });
        } else {
          console.warn("\u0410\u0442\u0440\u0438\u0431\u0443\u0442 price-info \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0443 \u043A\u043D\u043E\u043F\u043A\u0438:", elButton);
        }
      });
    }
  };

  // src/utils/burger_btn.ts
  var burger_btn = () => {
    let click = 0;
    $(".burger-button").click(function() {
      if (click === 0) {
        click++;
        $("body").css("overflow", "hidden");
      } else {
        click--;
        $("body").css("overflow", "visible");
      }
    });
    $(".burger-button").find("a").click(function() {
      click--;
      $("body").css("overflow", "visible");
    });
  };

  // src/utils/city-detector.ts
  function initCityDetector() {
    const slugify = (s) => s.trim().toLowerCase().replace(/\s+/g, "-");
    const unslugify = (s) => s.replace(/-/g, " ");
    const cityButtons = document.querySelectorAll("[location-dropdown_button]");
    const citySet = /* @__PURE__ */ new Map();
    cityButtons.forEach((btn) => {
      const slugAttr = btn.getAttribute("location-dropdown_button")?.trim();
      const slug = slugAttr ? slugify(slugAttr) : slugify(btn.textContent ?? "");
      if (!slug)
        return;
      const pretty = (btn.textContent ?? "").trim() || unslugify(slug);
      citySet.set(slug, pretty);
    });
    if (!citySet.size) {
      console.error("No cities found in DOM \u2014 aborting city detector.");
      return;
    }
    const cities = [...citySet.keys()];
    const getPrettyBySlug = (slug) => citySet.get(slug) ?? slug;
    const cityAlternationRegex = cities.join("|");
    const cityInUrlRegex = new RegExp(`(?:/city/|/|-)((${cityAlternationRegex}))(?:/|$)`, "i");
    const cityTailRegex = new RegExp(`-(${cityAlternationRegex})$`, "i");
    const defaultCitySlug = cities[0];
    const savedCitySlug = sessionStorage.getItem("savedCity") ?? null;
    const cityGuessEl = document.querySelector("[city-guess]");
    const tipEl = document.querySelector("[city-detector-tip]");
    const updateCityPlaceholders = (slug) => {
      const pretty = getPrettyBySlug(slug);
      document.querySelectorAll("[city-dropdown-name-placeholder]").forEach((node) => {
        node.textContent = pretty;
        node.classList.remove("opacity-0");
      });
      document.querySelectorAll("[location-dropdown]").forEach((d) => d.classList.remove("opacity-0"));
    };
    const activateCity = (slug) => {
      updateCityPlaceholders(slug);
      cityButtons.forEach((btn) => {
        const btnSlug = slugify(btn.getAttribute("location-dropdown_button") ?? "");
        btn.classList.toggle("is-active", btnSlug === slug);
      });
    };
    const getCityFromUrl = () => {
      const m = window.location.pathname.match(cityInUrlRegex);
      return m ? slugify(m[1]) : null;
    };
    const resolveCityViaApi = async () => {
      try {
        const cached = sessionStorage.getItem("cityFromApi");
        if (cached)
          return cached;
        const res = await fetch("https://ipinfo.io?token=e244e6770c04f8");
        const json = await res.json();
        const slug = slugify(json.city);
        if (cities.includes(slug)) {
          sessionStorage.setItem("cityFromApi", slug);
          return slug;
        }
      } catch {
      }
      return null;
    };
    const decideCity = async () => {
      const urlCity = getCityFromUrl();
      if (urlCity) {
        sessionStorage.setItem("savedCity", urlCity);
        return urlCity;
      }
      if (savedCitySlug)
        return savedCitySlug;
      const apiCity = await resolveCityViaApi();
      if (apiCity)
        return apiCity;
      return defaultCitySlug;
    };
    decideCity().then((currentSlug) => {
      activateCity(currentSlug);
      sessionStorage.setItem("savedCity", currentSlug);
      if (tipEl) {
        tipEl.classList.remove("hide");
        if (cityGuessEl)
          cityGuessEl.textContent = getPrettyBySlug(currentSlug);
      }
    });
    if (tipEl) {
      const btnYes = document.querySelector('[is-your-city-new-york="yes"]');
      const btnNo = document.querySelector('[is-your-city-new-york="no"]');
      const btnClose = document.querySelector("[city-detector-tip-close]");
      [btnYes, btnNo, btnClose].forEach(
        (btn) => btn?.addEventListener("click", () => tipEl.classList.add("hide"))
      );
      btnYes?.addEventListener("click", () => {
        const slug = slugify(cityGuessEl?.textContent ?? "");
        if (slug) {
          sessionStorage.setItem("savedCity", slug);
          activateCity(slug);
          window.location.href = `/city/${slug}`;
        }
      });
      btnNo?.addEventListener("click", () => {
        document.querySelector("[location-dropdown_list]")?.classList.add("w--open");
      });
    }
    document.querySelectorAll("[nav-home-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const path = window.location.pathname;
        const cityInPath = path.match(cityTailRegex)?.[1] ?? null;
        const targetSlug = sessionStorage.getItem("savedCity") ?? defaultCitySlug;
        if (cityInPath) {
          window.location.href = `/city/${targetSlug}`;
        } else {
          window.location.href = link.getAttribute("href") ?? "#";
        }
      });
    });
    const saveCityAndReload = (slug) => {
      sessionStorage.setItem("savedCity", slug);
      let newUrl = window.location.pathname.replace(cityTailRegex, `-${slug}`);
      if (newUrl === window.location.pathname) {
        newUrl = `/city/${slug}`;
      }
      const hash = window.location.hash;
      if (`${newUrl}${hash}` !== window.location.href) {
        window.location.href = `${newUrl}${hash}`;
      }
    };
    cityButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const slug = slugify(btn.getAttribute("location-dropdown_button") ?? "");
        if (slug)
          saveCityAndReload(slug);
      });
    });
    document.querySelectorAll("[home-page-city-links]").forEach((tile) => {
      tile.addEventListener("click", () => {
        const slug = slugify(tile.getAttribute("home-page-city-links") ?? "");
        if (slug)
          saveCityAndReload(slug);
      });
    });
  }

  // src/utils/contacts_redirect.ts
  var contacts_redirect = () => {
    document.querySelectorAll("[menu-contact]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("contacts");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.href = "/about#contacts";
        }
      });
    });
  };

  // src/utils/country-input.ts
  var countryInput_func = () => {
    const usaVariants = [
      "USA",
      "usa",
      "United States of America",
      "united states of america",
      "United States",
      "united states",
      "UNITED STATES"
    ];
    const countryInputs = document.querySelectorAll("[data-country]");
    countryInputs.forEach((countryElement) => {
      const handleCountryChange = () => {
        const stateInput = document.querySelector(`[data-state="${countryElement.dataset.country}"]`);
        const stateDropdown = document.querySelector(
          `[data-state-dropdown="${countryElement.dataset.country}"]`
        );
        if (!stateInput || !stateDropdown) {
          console.error("State input or dropdown not found for:", countryElement.dataset.country);
          return;
        }
        if (!usaVariants.includes(countryElement.value)) {
          stateDropdown.style.display = "none";
          stateInput.required = false;
        } else {
          stateDropdown.style.display = "block";
          stateInput.required = true;
        }
      };
      handleCountryChange();
      countryElement.addEventListener("input", handleCountryChange);
      countryElement.addEventListener("change", handleCountryChange);
    });
  };

  // src/utils/currentCity_input.ts
  var currentCity_input = () => {
    let city = "no-city";
    const cityAttr = document.body.getAttribute("this-is-a-city-page");
    if (cityAttr) {
      city = cityAttr;
    } else if (typeof sessionStorage !== "undefined") {
      const savedCity = sessionStorage.getItem("savedCity");
      if (savedCity) {
        city = savedCity;
      } else {
        const url = window.location.href.toLowerCase();
        const cities = ["new-york", "los-angeles", "chicago", "houston"];
        for (const cityName of cities) {
          if (url.includes(cityName)) {
            city = cityName.replace("-", " ");
            break;
          }
        }
      }
      const savedCityFromApi = sessionStorage.getItem("cityFromApi");
      if (!savedCity && savedCityFromApi) {
        city = savedCityFromApi;
      }
    } else {
      console.warn("localStorage \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0434\u0430\u043D\u043D\u044B\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043E\u043C.");
    }
    const forms = document.querySelectorAll("form");
    if (forms.length > 0) {
      forms.forEach(function(form) {
        let cityInput = form.querySelector('input[name="current-city"]');
        if (!cityInput) {
          cityInput = document.createElement("input");
          cityInput.type = "text";
          cityInput.classList.add("hide");
          cityInput.name = "current-city";
          form.appendChild(cityInput);
        }
        cityInput.value = city;
      });
    }
  };

  // src/utils/dates_redirect.ts
  var dates = () => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path !== "/dates") {
      return;
    }
    const defaultCity = "new york";
    const availableCities = ["new york", "los angeles", "chicago", "houston"];
    function normalizeCity(city) {
      return city.trim().toLowerCase().replace(/\s+/g, "-");
    }
    function handleRedirect(city) {
      const slug = normalizeCity(city);
      const targetPath = `/dates-night-${slug}`;
      if (window.location.pathname.replace(/\/$/, "") === targetPath)
        return;
      window.location.href = targetPath;
    }
    const savedCity = sessionStorage.getItem("savedCity");
    if (savedCity) {
      handleRedirect(savedCity);
      return;
    }
    console.log("[Redirect script] \u041D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u043E\u0433\u043E \u0433\u043E\u0440\u043E\u0434\u0430, \u0434\u0435\u043B\u0430\u0435\u043C fetch...");
    fetch("https://ipinfo.io?token=e244e6770c04f8").then((response) => response.json()).then((data) => {
      const apiCity = data.city;
      if (!apiCity) {
        handleRedirect(defaultCity);
        return;
      }
      const matchedCity = availableCities.find(
        (city) => city.toLowerCase() === apiCity.toLowerCase()
      );
      if (matchedCity) {
        sessionStorage.setItem("savedCity", matchedCity);
        handleRedirect(matchedCity);
      } else {
        handleRedirect(defaultCity);
      }
    }).catch((err) => {
      console.error("[Redirect script] \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 fetch:", err);
      handleRedirect(defaultCity);
    });
  };

  // src/utils/exp-catalog-params.ts
  function initExpParams() {
    const root = document.querySelector("[catalog-page-city]");
    if (!root)
      return;
    const pageCity = root.getAttribute("catalog-page-city")?.trim();
    if (!pageCity)
      return;
    const cards = document.querySelectorAll("[exp-collection-item]");
    const parseList = (raw) => (raw ?? "").split(";").map((s) => s.trim()).filter(Boolean);
    cards.forEach((card) => {
      (() => {
        const set = new Set(parseList(card.getAttribute("value-best")));
        if (set.has(pageCity)) {
          card.querySelector('[exp-columns_slider-header-meta-item="best"]')?.classList.remove("hide");
        }
      })();
      (() => {
        const pair = parseList(card.getAttribute("value-age")).map((p) => p.split("@")).find(([city]) => city === pageCity);
        if (!pair)
          return;
        const [, ageCode] = pair;
        const preset = document.querySelector(`[icon-age="${ageCode}"]`);
        const container = card.querySelector(
          '[exp-columns_slider-header-meta-item="age"]'
        );
        if (preset && container) {
          container.appendChild(preset.cloneNode(true));
          container.classList.remove("hide");
        }
      })();
      const applyTextParam = (attr, slug) => {
        const pair = parseList(card.getAttribute(attr)).map((p) => p.split("@")).find(([city]) => city === pageCity);
        if (!pair)
          return;
        const [, value] = pair;
        const container = card.querySelector(
          `[exp-columns_slider-header-meta-item="${slug}"]`
        );
        const valueEl = container?.querySelector(
          `[exp-columns_slider-header-meta-item="${slug}-text-value"]`
        );
        if (container && valueEl) {
          valueEl.textContent = value;
          container.classList.remove("hide");
        }
      };
      applyTextParam("value-price", "price");
      applyTextParam("value-count", "count");
    });
  }

  // src/utils/exp-selector.ts
  var expSelector_func = () => {
    const expSelector_el = document.querySelectorAll("[this-is-a-city-page]");
    if (expSelector_el.length) {
      let detectedCity = sessionStorage.getItem("savedCity");
      if (!detectedCity) {
        const urlPath = window.location.pathname.toLowerCase();
        const cityMatch = urlPath.match(
          /(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)(?=$|\/)/i
        );
        detectedCity = cityMatch ? cityMatch[1].toLowerCase() : null;
        if (cityMatch) {
          sessionStorage.setItem("savedCity", cityMatch[1].toLowerCase());
        }
      }
      expSelector_el.forEach((bodyElement) => {
        const allDropDowns = bodyElement.querySelectorAll("[exp-variants-dropdown]");
        allDropDowns.forEach((allDropDown_el) => {
          const currentDropdownMenu = allDropDown_el.querySelectorAll(
            "[exp-dropdown-button-list-new]"
          );
          currentDropdownMenu.forEach((currentDropdownMenu_el) => {
            const allSvgInside = currentDropdownMenu_el.querySelectorAll("svg");
            allSvgInside.forEach((svg) => svg.classList.add("hide"));
            const allExpButtons = currentDropdownMenu_el.querySelectorAll("[exp-city-dropdown]");
            allExpButtons.forEach((el_allExpButtons) => {
              const currentListElement = el_allExpButtons.querySelector("[exp-city-dropdown-list]");
              if (currentListElement) {
                currentListElement.classList.add("hide");
              }
              el_allExpButtons.addEventListener(
                "click",
                function() {
                  if (detectedCity) {
                    const allIncludedLinks = el_allExpButtons.querySelectorAll("a");
                    allIncludedLinks.forEach((link) => {
                      const currentLinkCity = link.getAttribute("exp-city-dropdown-city-slug");
                      if (currentLinkCity === detectedCity) {
                        window.location.href = link.href;
                      }
                    });
                  } else {
                    el_allExpButtons.querySelectorAll("a").forEach((link) => {
                      link.addEventListener("click", () => {
                        window.location.href = link.href;
                      });
                    });
                  }
                },
                { once: true }
              );
            });
          });
        });
      });
    }
  };

  // src/utils/exp-slider-link-creator.ts
  var expSliderLinkCreator_func = () => {
    const expSliderLinkCreator_el = document.querySelectorAll("[abs-link-for-append]");
    if (expSliderLinkCreator_el.length) {
      const abs_link_individual = document.querySelector("[abs-link-exp-individual]");
      const abs_link_group = document.querySelector("[abs-link-exp-group]");
      const all_sliders_individual = document.querySelectorAll("[exp-slider-individual]");
      const all_sliders_group = document.querySelectorAll("[exp-slider-group]");
      const city_current = document.querySelector("[page-city-current]").getAttribute("page-city-current");
      all_sliders_individual.forEach((slider_individual) => {
        const clone_abs_link = abs_link_individual.cloneNode(true);
        clone_abs_link.classList.remove("hide");
        const link_updated = clone_abs_link.getAttribute("href") + "#" + slider_individual.getAttribute("exp-name");
        clone_abs_link.setAttribute("href", link_updated);
        slider_individual.appendChild(clone_abs_link);
      });
      all_sliders_group.forEach((slider_group) => {
        const clone_abs_link = abs_link_group.cloneNode(true);
        clone_abs_link.classList.remove("hide");
        const link_updated = clone_abs_link.getAttribute("href") + "#" + slider_group.getAttribute("exp-name");
        clone_abs_link.setAttribute("href", link_updated);
        slider_group.appendChild(clone_abs_link);
      });
    }
  };

  // src/utils/exp-video-on-hover.ts
  var expVideoOnHover_func = () => {
    const expVideoOnHover_el = document.querySelectorAll("[video-on-hover]");
    if (expVideoOnHover_el.length) {
      expVideoOnHover_el.forEach((hover_el) => {
        hover_el.isPlaying = false;
        hover_el.videoLoaded = false;
        const playVideo = (hover_el2) => {
          const currentSrcWaiter = hover_el2.querySelector("[put-src-here]");
          if (currentSrcWaiter) {
            const src = currentSrcWaiter.getAttribute("put-src-here");
            if (src && currentSrcWaiter.getAttribute("src") !== src) {
              currentSrcWaiter.setAttribute("src", src);
            }
          }
          const currentEmbed = hover_el2.querySelector("[abs-video-for-hover-hided]");
          if (currentEmbed) {
            currentEmbed.classList.remove("hide");
          }
          const currentVideo = hover_el2.querySelector("video");
          if (currentVideo) {
            if (!hover_el2.videoLoaded) {
              const handleCanPlayThrough = () => {
                hover_el2.videoLoaded = true;
                currentVideo.play().then(() => {
                  hover_el2.isPlaying = true;
                }).catch((error) => {
                  console.error("Error playing video:", error);
                });
                currentVideo.removeEventListener("canplaythrough", handleCanPlayThrough);
              };
              currentVideo.addEventListener("canplaythrough", handleCanPlayThrough);
              currentVideo.load();
            } else if (!hover_el2.isPlaying) {
              currentVideo.play().then(() => {
                hover_el2.isPlaying = true;
              }).catch((error) => {
                console.error("Error playing video:", error);
              });
            }
          }
        };
        const pauseVideo = (hover_el2) => {
          const currentEmbed = hover_el2.querySelector("[abs-video-for-hover-hided]");
          if (currentEmbed) {
            currentEmbed.classList.add("hide");
          }
          const currentVideo = hover_el2.querySelector("video");
          if (currentVideo && hover_el2.isPlaying) {
            currentVideo.pause();
            hover_el2.isPlaying = false;
          }
        };
        const handlePointerEnter = () => {
          if (window.innerWidth >= 992) {
            playVideo(hover_el);
          }
        };
        const handlePointerLeave = () => {
          if (window.innerWidth >= 992) {
            pauseVideo(hover_el);
          }
        };
        hover_el.addEventListener("pointerenter", handlePointerEnter);
        hover_el.addEventListener("pointerleave", handlePointerLeave);
        if (window.innerWidth < 992) {
          const slideEl = hover_el.closest(".swiper-slide");
          if (slideEl) {
            const observer = new MutationObserver((mutationsList) => {
              for (const mutation of mutationsList) {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                  if (slideEl.classList.contains("swiper-slide-active")) {
                    playVideo(hover_el);
                  } else {
                    pauseVideo(hover_el);
                  }
                }
              }
            });
            observer.observe(slideEl, { attributes: true });
            if (slideEl.classList.contains("swiper-slide-active")) {
              playVideo(hover_el);
            }
            hover_el.mutationObserver = observer;
          }
        }
      });
    }
  };

  // src/utils/exp-video-on-hover-catalog-page.ts
  var catalogItemExp_func = () => {
    const catalogItemExp_el = document.querySelectorAll("[catalog-item-exp]");
    if (catalogItemExp_el.length) {
      catalogItemExp_el.forEach((cl_i) => {
        const firstSlide = cl_i.querySelector("[catalog-item-exp-gallery-item]");
        const currentLightbox = cl_i.querySelector("[ctatalog-video]");
        const embedVideo = cl_i.querySelector("[abs-video-for-hover]");
        const embedVideo_srcElement_toPut = cl_i.querySelector("[put-src-here]");
        firstSlide.appendChild(currentLightbox);
        const handleMouseOver = function() {
          if (window.innerWidth >= 992) {
            if (embedVideo_srcElement_toPut) {
              const src = embedVideo_srcElement_toPut.getAttribute("put-src-here");
              if (src) {
                embedVideo_srcElement_toPut.setAttribute("src", src);
              }
            }
            if (embedVideo) {
              embedVideo.classList.remove("hide");
            }
            let currentVideo = embedVideo.querySelector("video");
            if (currentVideo) {
              const newVideoElement = currentVideo.cloneNode(true);
              currentVideo.parentNode.replaceChild(newVideoElement, currentVideo);
              currentVideo = newVideoElement;
              currentVideo.addEventListener("canplay", () => {
                currentVideo.play().catch((error) => {
                });
              });
              currentVideo.addEventListener("play", () => {
              });
              currentVideo.addEventListener("pause", () => {
              });
              currentVideo.addEventListener("timeupdate", function() {
              });
              currentVideo.addEventListener("canplaythrough", () => {
              });
            }
          }
        };
        const handleMouseOut = function() {
          if (window.innerWidth >= 992) {
            if (embedVideo) {
              embedVideo.classList.add("hide");
            }
            const currentVideo = embedVideo.querySelector("video");
            if (currentVideo) {
              currentVideo.pause();
            }
          }
        };
        firstSlide.addEventListener("mouseover", handleMouseOver);
        firstSlide.addEventListener("mouseout", handleMouseOut);
      });
    }
  };

  // src/utils/experience-state-filter.ts
  function experienceStateFilter_func() {
    const cards = document.querySelectorAll("[experience-card], [exp-collection-item]");
    if (!cards.length)
      return;
    const slugify = (s) => s.trim().toLowerCase().replace(/\s+/g, "-");
    const parseList = (raw) => (raw ?? "").split(";").map((s) => slugify(s)).filter(Boolean);
    let currentState = null;
    try {
      const saved = sessionStorage.getItem("savedCity");
      if (saved)
        currentState = slugify(saved);
    } catch {
    }
    if (!currentState) {
      const m = window.location.pathname.match(/(?:\/city\/|\/|-)([a-z0-9\-]+)(?:$|\/)/i);
      if (m)
        currentState = slugify(m[1]);
    }
    if (!currentState) {
      const bodyState = document.body.getAttribute("this-is-a-city-page");
      if (bodyState)
        currentState = slugify(bodyState);
    }
    if (!currentState) {
      for (const card of Array.from(cards)) {
        const list = parseList(card.getAttribute("available-states")) || parseList(card.getAttribute("available-cities")) || parseList(card.getAttribute("data-available"));
        if (list.length) {
          currentState = list[0];
          break;
        }
      }
    }
    if (!currentState)
      return;
    const parseKeyed = (raw) => (raw ?? "").split(";").map((s) => s.trim()).filter(Boolean).map((pair) => slugify(pair.split("@")[0] ?? "")).filter(Boolean);
    cards.forEach((card) => {
      const explicit = parseList(card.getAttribute("available-states")) || parseList(card.getAttribute("available-cities")) || parseList(card.getAttribute("data-available"));
      const derived = /* @__PURE__ */ new Set([
        ...parseKeyed(card.getAttribute("value-price")),
        ...parseKeyed(card.getAttribute("value-count")),
        ...parseKeyed(card.getAttribute("value-age"))
      ]);
      const available = explicit.length ? explicit : Array.from(derived);
      if (!available.length)
        return;
      const isVisible = available.includes(currentState);
      card.classList.toggle("hide", !isVisible);
    });
  }

  // src/utils/faq-hider.ts
  var faqHider_func = () => {
    const faqHider_el = document.querySelectorAll(".section_faq");
    if (faqHider_el.length) {
      faqHider_el.forEach((faq_section) => {
        const allFaqItems = faq_section.querySelectorAll(".cl-i_faq");
        if (!allFaqItems.length) {
          faq_section.classList.add("hide");
        }
      });
    }
  };

  // src/utils/footer-year.ts
  var footer_yer = () => {
    const currentYearField = document.getElementById("current-year");
    if (currentYearField)
      currentYearField.innerText = String((/* @__PURE__ */ new Date()).getFullYear());
  };

  // src/utils/form-selectors.ts
  var formSelectors_func = () => {
    const formSelectors_el = document.querySelectorAll('[form-custom-dropdwn="component"]');
    if (formSelectors_el.length) {
      document.querySelectorAll('[form-custom-dropdwn="component"]').forEach((component) => {
        component.addEventListener("change", (event) => {
          if (event.target.type === "radio") {
            const radio = event.target;
            let label = radio.nextElementSibling;
            if (label && label.getAttribute("form-custom-dropdwn") !== "radio-label") {
              label = null;
            }
            const placeholder = component.querySelector('[form-custom-dropdwn="placeholder"]');
            if (label && placeholder) {
              placeholder.textContent = label.textContent;
              placeholder.classList.add("label-is-active");
            }
            if (label) {
              label.classList.add("label-is-active");
            }
            const allLabels = component.querySelectorAll('[form-custom-dropdwn="radio-label"]');
            allLabels.forEach((lbl) => {
              if (lbl !== label) {
                lbl.classList.remove("label-is-active");
              }
            });
          }
        });
      });
    }
  };
  formSelectors_func();

  // src/utils/giftCard_redirect.ts
  function giftCard_redirect() {
    const giftCardLink = document.querySelector('[data-menu-link="gift-card"]');
    if (!giftCardLink)
      return;
    giftCardLink.addEventListener("click", (event) => {
      event.preventDefault();
      const savedCity = sessionStorage.getItem("savedCity") || "new-york";
      const citySlug = savedCity.replace(" ", "-");
      const targetUrl = `/city/${citySlug}#gift-card`;
      window.location.href = targetUrl;
    });
  }

  // src/utils/main-page-city-selector-mobile.ts
  var menuSelectorMobile_func = () => {
    const menuTrigger = document.querySelector(".menu-standart-trigger-city");
    if (menuTrigger) {
      let whereAreWeScroll2 = function() {
        const triggerRect = menuTrigger.getBoundingClientRect();
        if (triggerRect.bottom < 0) {
          const elementsWithToggleClass = document.querySelectorAll("[toggle-class-here-selector]");
          elementsWithToggleClass.forEach((element) => {
            const toggleClass = element.getAttribute("toggle-class-here-selector");
            if (toggleClass) {
              element.classList.remove(toggleClass);
            }
          });
        } else {
          const elementsWithToggleClass = document.querySelectorAll("[toggle-class-here-selector]");
          elementsWithToggleClass.forEach((element) => {
            const toggleClass = element.getAttribute("toggle-class-here-selector");
            if (toggleClass) {
              element.classList.add(toggleClass);
            }
          });
        }
      }, handleScroll2 = function() {
        whereAreWeScroll2();
      };
      var whereAreWeScroll = whereAreWeScroll2, handleScroll = handleScroll2;
      whereAreWeScroll2();
      window.addEventListener("scroll", handleScroll2);
    }
  };

  // src/utils/menu-color.ts
  var menuColor_func = () => {
    const menuTrigger = document.querySelector(".menu-standart-trigger");
    if (menuTrigger) {
      let whereAreWeScroll2 = function() {
        const triggerRect = menuTrigger.getBoundingClientRect();
        if (triggerRect.bottom < 0) {
          const elementsWithToggleClass = document.querySelectorAll("[toggle-class-here]");
          elementsWithToggleClass.forEach((element) => {
            const toggleClass = element.getAttribute("toggle-class-here");
            if (toggleClass) {
              element.classList.add(toggleClass);
            }
          });
        } else {
          const elementsWithToggleClass = document.querySelectorAll("[toggle-class-here]");
          elementsWithToggleClass.forEach((element) => {
            const toggleClass = element.getAttribute("toggle-class-here");
            if (toggleClass) {
              element.classList.remove(toggleClass);
            }
          });
        }
      }, handleScroll2 = function() {
        whereAreWeScroll2();
      };
      var whereAreWeScroll = whereAreWeScroll2, handleScroll = handleScroll2;
      whereAreWeScroll2();
      window.addEventListener("scroll", handleScroll2);
    }
  };

  // src/utils/mobile_menu.ts
  var mobile_menu = () => {
    const burgerButton = document.querySelector("[data-burger-button]");
    const menuItems = document.querySelectorAll("[data-menu-item]");
    const menu = document.querySelector("[data-menu]");
    const breakpoint = 992;
    const toggleMenu = () => {
      if (window.innerWidth <= breakpoint && menu) {
        menu.classList.toggle("open");
      }
    };
    burgerButton?.addEventListener("click", toggleMenu);
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= breakpoint) {
          burgerButton?.click();
        }
      });
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > breakpoint && menu?.classList.contains("open")) {
        menu.classList.remove("open");
      }
    });
  };

  // src/utils/selection-all-button.ts
  var selectionAllButton_func = () => {
    const selectionAllButton_el = document.querySelector(".exp-columns_inner");
    const currentSelectorButton = document.querySelector(
      ".dropdown-placeholder.is-exp-filter.is-new"
    );
    if (selectionAllButton_el) {
      if (currentSelectorButton.textContent != "All" & currentSelectorButton.textContent != "ALL") {
        const list_links_dropdown = selectionAllButton_el.querySelector(
          ".location-dropdown_list.is-form"
        );
        const allLinks = list_links_dropdown.querySelectorAll(".w-dyn-item");
        const firstLinkCloneAble = allLinks[0].cloneNode(true);
        const currentParent = allLinks[0].parentNode;
        firstLinkCloneAble.querySelector("a").textContent = "ALL";
        const path = window.location.pathname;
        const newPath = path.substring(0, path.lastIndexOf("/"));
        firstLinkCloneAble.querySelector("a").setAttribute("href", newPath);
        currentParent.insertBefore(firstLinkCloneAble, allLinks[0]);
      }
    }
  };

  // src/utils/sliders-colors.ts
  var coloredSlider_func = () => {
    const coloredSlider_el = document.querySelectorAll("[colored-slider]");
    if (coloredSlider_el.length) {
      coloredSlider_el.forEach((swiperColored) => {
        const currentColorPattern = swiperColored.getAttribute("colored-slider");
        const colors = currentColorPattern.split(",").map((color) => color.trim());
        const allSwiperSlides = swiperColored.querySelectorAll(".swiper-slide");
        allSwiperSlides.forEach((slide, index) => {
          const colorIndex = index % colors.length;
          slide.style.backgroundColor = colors[colorIndex];
        });
      });
    }
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    initCityDetector();
    formSelectors_func();
    initExpParams();
    coloredSlider_func();
    expSliderLinkCreator_func();
    expVideoOnHover_func();
    catalogItemExp_func();
    menuColor_func();
    menuSelectorMobile_func();
    expSelector_func();
    faqHider_func();
    bookLinks_func();
    experienceStateFilter_func();
    selectionAllButton_func();
    countryInput_func();
    footer_yer();
    giftCard_redirect();
    mobile_menu();
    currentCity_input();
    burger_btn();
    contacts_redirect();
    dates();
  });
})();
//# sourceMappingURL=index.js.map
