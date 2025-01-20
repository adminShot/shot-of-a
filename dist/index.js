"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/book-now-links.ts
  var bookLinks_func = () => {
    const bookLinks_el = document.querySelectorAll("[book-now-button]");
    console.log("\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043A\u043D\u043E\u043F\u043E\u043A:", bookLinks_el.length);
    if (bookLinks_el.length) {
      bookLinks_el.forEach((elButton) => {
        const linkFromAtribute = elButton.getAttribute("book-now-button");
        const priceFromAttribute = elButton.getAttribute("price-info");
        const currentCity = document.body.getAttribute("this-is-a-city-page");
        console.log("\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0433\u043E\u0440\u043E\u0434:", currentCity);
        if (linkFromAtribute) {
          const atribute_linksItemsList_readyFalse = linkFromAtribute.split(";").filter((item) => item.trim() !== "");
          console.log("\u0421\u043F\u0438\u0441\u043E\u043A \u043D\u0435\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0445 \u0441\u0441\u044B\u043B\u043E\u043A:", atribute_linksItemsList_readyFalse);
          atribute_linksItemsList_readyFalse.forEach((el) => {
            console.log("\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0441\u0441\u044B\u043B\u043A\u0438:", el);
            const part_first = el.split("@")[0];
            const part_second = el.split("@")[1];
            console.log("\u0427\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0432\u0430\u044F (\u0433\u043E\u0440\u043E\u0434):", part_first);
            console.log("\u0427\u0430\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0430\u044F (\u0441\u0441\u044B\u043B\u043A\u0430):", part_second);
            if (part_first === currentCity) {
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
            const price_city = priceEl.split("@")[0];
            const price_value = priceEl.split("@")[1];
            console.log("\u0427\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0432\u0430\u044F (\u0433\u043E\u0440\u043E\u0434):", price_city);
            console.log("\u0427\u0430\u0441\u0442\u044C \u0432\u0442\u043E\u0440\u0430\u044F (\u0446\u0435\u043D\u0430):", price_value);
            if (price_city === currentCity) {
              elButton.setAttribute("data-price", price_value);
              const parentWithPriceText = elButton.closest(".exp-slider_title-wrapper")?.querySelector("[data-price-text]");
              if (parentWithPriceText) {
                parentWithPriceText.setAttribute("data-price-text", price_value);
                parentWithPriceText.innerText = price_value;
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

  // src/utils/city-detector.ts
  var cityDetector_func = () => {
    const defaultCity = "new york";
    const savedCity = sessionStorage.getItem("savedCity") ? sessionStorage.getItem("savedCity").replace("-", " ") : null;
    function getCityFromCurrentUrl() {
      const urlPath = window.location.pathname;
      const cityMatch = urlPath.match(/(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i);
      return cityMatch ? cityMatch[1].toLowerCase().replace("-", " ") : null;
    }
    function setDefaultCity() {
      const defaultButton = Array.from(document.querySelectorAll("[location-dropdown_button]")).find(
        (button) => button.textContent.toUpperCase() === defaultCity.toUpperCase()
      );
      updateCityPlaceholders(defaultButton, defaultCity);
    }
    async function func_locationApi() {
      try {
        const response = await fetch("https://ipinfo.io?token=e244e6770c04f8");
        const data = await response.json();
        const { city: apiCity } = data;
        if (savedCity) {
          findAndUpdateCity(savedCity);
          return;
        }
        const availableCities = ["new york", "los angeles", "chicago", "houston"];
        const matchedCity = availableCities.find(
          (city) => city.toLowerCase() === apiCity.toLowerCase()
        );
        if (matchedCity) {
          findAndUpdateCity(matchedCity);
          document.querySelector("[city-guess]").textContent = matchedCity;
        } else {
          setDefaultCity();
        }
      } catch (error) {
        setDefaultCity();
      }
    }
    function findAndUpdateCity(cityName) {
      const matchedButton = Array.from(document.querySelectorAll("[location-dropdown_button]")).find(
        (button) => button.textContent.toUpperCase() === cityName.toUpperCase()
      );
      if (matchedButton) {
        updateCityPlaceholders(matchedButton, cityName);
      } else {
        setDefaultCity();
      }
    }
    function updateCityPlaceholders(cityButton, cityName) {
      if (!cityButton)
        return;
      document.querySelectorAll("[city-dropdown-name-placeholder]").forEach((placeholder) => {
        placeholder.textContent = cityName;
        placeholder.classList.remove("opacity-0");
      });
      document.querySelectorAll("[location-dropdown]").forEach((dropdown) => {
        dropdown.classList.remove("opacity-0");
      });
    }
    if (savedCity) {
      findAndUpdateCity(savedCity);
    } else {
      const urlCity = getCityFromCurrentUrl();
      document.querySelector("[city-detector-tip]")?.classList.remove("hide");
      document.querySelector("[city-guess]").textContent = defaultCity;
      if (urlCity) {
        findAndUpdateCity(urlCity);
      } else {
        func_locationApi();
      }
    }
    const button_yes = document.querySelector('[is-your-city-new-york="yes"]');
    const button_no = document.querySelector('[is-your-city-new-york="no"]');
    const button_close = document.querySelector("[city-detector-tip-close]");
    const elements_navHomeLinks = document.querySelectorAll("[nav-home-link]");
    const elements_homePageCityLinks = document.querySelectorAll("[home-page-city-links]");
    [button_yes, button_no, button_close].forEach((btn) => {
      btn?.addEventListener(
        "click",
        () => document.querySelector("[city-detector-tip]").classList.add("hide")
      );
    });
    button_yes?.addEventListener("click", () => {
      const currentCity = document.querySelector("[city-guess]").textContent.toLowerCase().replace(" ", "-");
      sessionStorage.setItem("savedCity", currentCity);
      findAndUpdateCity(currentCity);
      window.location.href = "/city/" + currentCity;
    });
    button_no?.addEventListener("click", () => {
      document.querySelector("[location-dropdown_list")?.classList.add("w--open");
    });
    elements_navHomeLinks.forEach((navHomeLink) => {
      navHomeLink.addEventListener("click", (event) => {
        event.preventDefault();
        const cityPattern = /(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i;
        const currentPath = window.location.pathname;
        const cityMatch = currentPath.match(cityPattern);
        const detectedCity = savedCity || defaultCity;
        if (cityMatch) {
          window.location.href = `/city/${detectedCity.replace(" ", "-")}`;
        } else {
          const cityHref = navHomeLink.getAttribute("href");
          window.location.href = cityHref || "#";
        }
      });
    });
    elements_homePageCityLinks.forEach((cityLink) => {
      cityLink.addEventListener("click", function() {
        saveCity(cityLink);
      });
    });
    const locationDropdownButtons = document.querySelectorAll("[location-dropdown_button]");
    locationDropdownButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        saveCity(button);
      });
    });
    function saveCity(cityButton) {
      const cityName = cityButton.getAttribute("location-dropdown_button") || cityButton.getAttribute("home-page-city-links");
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      if (cityName) {
        sessionStorage.setItem("savedCity", cityName);
        const isExperiencePage = /individual-art-experiences-/i.test(currentPath);
        const isEventPage = /events-/i.test(currentPath);
        const isDatesPage = /dates-night-/i.test(currentPath);
        let newUrl = currentPath;
        const currentCityPattern = /-(new-york|los-angeles|chicago|houston)$/i;
        const match = currentPath.match(currentCityPattern);
        if (match && match[1].toLowerCase().replace("-", " ") !== cityName.toLowerCase()) {
          newUrl = currentPath.replace(currentCityPattern, `-${cityName.replace(" ", "-")}`);
        } else if (!match && !(isExperiencePage || isEventPage || isDatesPage)) {
          newUrl = `/city/${cityName.replace(" ", "-")}`;
        }
        updateCityPlaceholders(cityButton, cityName);
        if (`${newUrl}${currentHash}` !== window.location.href) {
          window.location.href = `${newUrl}${currentHash}`;
        }
      } else {
        console.warn("City name not found on the button.");
      }
    }
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

  // src/utils/exp-catalog-params.ts
  var expParams_func = () => {
    const expParams_el = document.querySelector("[catalog-page-city]");
    if (expParams_el) {
      const page_city = expParams_el.getAttribute("catalog-page-city");
      const array_expCollectionItems = document.querySelectorAll("[exp-collection-item]");
      array_expCollectionItems.forEach((expCollectionItem) => {
        function display_bestSeller() {
          const currentElement = expCollectionItem.querySelector(
            "[exp-columns_slider-header-meta-item=best]"
          );
          const currentAttributeValue = expCollectionItem.getAttribute("value-best");
          const array_params = currentAttributeValue.split(";");
          array_params.forEach((param, id) => {
            if (param === "") {
              array_params.splice(id, 1);
            }
          });
          array_params.forEach((el) => {
            if (el === page_city) {
              currentElement.classList.remove("hide");
            }
          });
        }
        function display_age() {
          const allIconPresets = document.querySelectorAll("[icon-age]");
          const currentElement = expCollectionItem.querySelector(
            "[exp-columns_slider-header-meta-item=age]"
          );
          const currentAttributeValue = expCollectionItem.getAttribute("value-age");
          const array_params = currentAttributeValue.split(";");
          array_params.forEach((param, id) => {
            if (param === "") {
              array_params.splice(id, 1);
            }
          });
          array_params.forEach((param) => {
            const smallArray = param.split("@");
            if (smallArray[0] === page_city) {
              allIconPresets.forEach((icon) => {
                const iconAttribute = icon.getAttribute("icon-age");
                if (smallArray[1] === iconAttribute) {
                  const elementToCopy = icon;
                  const newParent = currentElement;
                  const newElement = document.createElement("div");
                  newElement.innerHTML = elementToCopy.innerHTML;
                  newParent.appendChild(newElement);
                }
              });
            }
          });
        }
        function display_price() {
          const currentElement = expCollectionItem.querySelector(
            "[exp-columns_slider-header-meta-item=price]"
          );
          const currentAttributeValue = expCollectionItem.getAttribute("value-price");
          const array_params = currentAttributeValue.split(";");
          array_params.forEach((param, id) => {
            if (param === "") {
              array_params.splice(id, 1);
            }
          });
          array_params.forEach((param) => {
            const smallArray = param.split("@");
            if (smallArray[0] === page_city) {
              const city = smallArray[0];
              const paramValue = smallArray[1];
              if (city === page_city) {
                currentElement.classList.remove("hide");
                const currentPriceTextValue = currentElement.querySelector(
                  '[exp-columns_slider-header-meta-item="price-text-value"]'
                );
                currentPriceTextValue.textContent = paramValue;
              }
            }
          });
        }
        function display_people() {
          const currentElement = expCollectionItem.querySelector(
            "[exp-columns_slider-header-meta-item=count]"
          );
          const currentAttributeValue = expCollectionItem.getAttribute("value-count");
          const array_params = currentAttributeValue.split(";");
          array_params.forEach((param, id) => {
            if (param === "") {
              array_params.splice(id, 1);
            }
          });
          array_params.forEach((param) => {
            const smallArray = param.split("@");
            if (smallArray[0] === page_city) {
              const city = smallArray[0];
              const paramValue = smallArray[1];
              if (city === page_city) {
                currentElement.classList.remove("hide");
                const currentPriceTextValue = currentElement.querySelector(
                  '[exp-columns_slider-header-meta-item="count-text-value"]'
                );
                currentPriceTextValue.textContent = paramValue;
              }
            }
          });
        }
        display_bestSeller();
        display_age();
        display_price();
        display_people();
      });
    }
  };

  // src/utils/exp-selector.ts
  var expSelector_func = () => {
    const expSelector_el = document.querySelectorAll("[this-is-a-city-page]");
    if (expSelector_el.length) {
      let detectedCity = sessionStorage.getItem("savedCity");
      if (!detectedCity) {
        const urlPath = window.location.pathname.toLowerCase();
        const cityMatch = urlPath.match(/(?:\/city\/|\/|-)(new-york|los-angeles|chicago|houston)$/i);
        detectedCity = cityMatch ? cityMatch[1].toLowerCase() : null;
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
    cityDetector_func();
    formSelectors_func();
    expParams_func();
    coloredSlider_func();
    expSliderLinkCreator_func();
    expVideoOnHover_func();
    catalogItemExp_func();
    menuColor_func();
    menuSelectorMobile_func();
    expSelector_func();
    faqHider_func();
    bookLinks_func();
    selectionAllButton_func();
    countryInput_func();
  });
})();
//# sourceMappingURL=index.js.map
