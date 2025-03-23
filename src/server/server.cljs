(ns server.server
  (:require
   [clojure.string]))

(defn ^:export main [timeout]
  (prn "Hello World!")
  (js/setInterval #() timeout))

(defn ^:dev/after-load reload! []
  (prn "Reload CLJS"))

(comment
  (+ 1 2))
