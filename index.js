import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, I18nManager, Animated, Easing } from "react-native";
import Collapsible from "react-native-collapsible";

export default ({
  children,
  title = "",
  initExpanded = false,
  expanded = null,
  unmountOnCollapse = false,
  isRTL = "auto",
  duration = 300,
  collapsibleProps = {},
  collapsibleContainerStyle = {},
  arrowSize = 24,
  noArrow = false,
  style = {},
}) => {
  let controlled = expanded === null ? false : true;
  const [show, setShow] = useState(initExpanded);
  const [mounted, setMounted] = useState(initExpanded);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  // let _show = show;
  if (controlled) {
    if (!mounted && expanded) setMounted(true);
  }

  const handleArrowRotate = (open = null) => {
    const _open = open === null ? show : open;
    if (!_open)
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    else {
      Animated.timing(rotateAnim, {
        toValue: rotateAngle,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleAnimationEnd = () => {
    if (unmountOnCollapse && !show) setMounted(false);
  };

  const handleToggleShow = () => {
    if (!controlled)
      if (!mounted) {
        if (!show) setMounted(true);
      } else {
        setShow(!show);
      }
  };

  // place the arrow on the left or the right based on the device direction and isRTL property
  let RTLdir = "row";
  if (isRTL === "auto") isRTL = I18nManager.isRTL;
  else if (isRTL !== I18nManager.isRTL) RTLdir = "row-reverse";

  const rotateAngle = ((isRTL ? 90 : -90) * 3.14159) / 180;
  const TitleElement = typeof title === "string" ? <Text style={styles.TitleText}>{title}</Text> : title;

  useEffect(() => {
    // this part is to trigger collapsible animation only after he has been fully mounted so animation would
    // not be interrupted.
    if (mounted) {
      setShow(true);
      // handleArrowRotate();
    }
  }, [mounted]);

  useEffect(() => {
    // on mounting set the rotation angel
    rotateAnim.setValue(show ? 0 : rotateAngle);
  }, []);

  useEffect(() => {
    if (mounted) handleArrowRotate(!show);
    if (controlled && show != expanded) setShow(expanded);
  });

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleToggleShow}>
      <View
        style={{
          flexDirection: RTLdir,
          alignItems: "center",
        }}
      >
        {noArrow ? null : (
          <Animated.View style={{ transform: [{ rotate: rotateAnim }] }}>
            <Image style={{ width: arrowSize, height: arrowSize }} source={require("./arrow-down.png")} />
          </Animated.View>
        )}
        {TitleElement}
      </View>
      {mounted ? (
        <View style={{ width: "100%", ...collapsibleContainerStyle }}>
          <Collapsible onAnimationEnd={handleAnimationEnd} collapsed={!show} {...{ duration, ...collapsibleProps }}>
            {children}
          </Collapsible>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 5,
    borderColor: "grey",
    borderWidth: 1,
    borderStyle: "solid",
  },
  TitleText: { color: "#3385ff", fontSize: 16, padding: 5 },
});